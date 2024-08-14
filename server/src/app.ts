// 外部ライブラリ
import express, { Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import session from 'express-session';
import Redis from 'ioredis';
import RedisStore from 'connect-redis'

// 自作
import prisma from "./infra/db";
import { toHashed } from "./lib/cipher";
import { UserRepository } from "./repositories/user-repository";
import rateLimit from "express-rate-limit";
import { WorkspaceRepository } from "./repositories/workspace-repository";
import { User } from "@prisma/client";
import { AuthorityRepository } from "./repositories/authority-repository";
import { AppFormRepository } from "./repositories/app-form-repository";
import { SearchOption } from "./schema/post";


declare module 'express-session' {
    interface SessionData {
        userId: number;
        userName: string;
        workspaces: Workspace[];
        authorities: Authrity[];
    }

    interface Workspace {
        workspaceId: number;
        workspaceName: string;
    }

    interface Authrity {
        workspaceId: number;
        authorityId: number;
    }
}

// アプリケーションで動作するようにdotenvを設定する
dotenv.config();
const app = express();

const redisUrl: string = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient = new Redis(redisUrl, {
    password: process.env.REDIS_PASSWORD,
});

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);


app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        path: '/',
        httpOnly: true,
        secure: false,
        maxAge: 1000 * 60 * 60
    },
    store: new RedisStore({
        client: redisClient,
        disableTouch: true
    })
}));

// CORSの許可
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_DOMAIN)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Credentials', 'true')
    next()
})

// form-urlencodedデータのパース
app.use(bodyParser.urlencoded({ extended: true }));

// JSONデータのパース
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Hello World");
});

app.post("/account/login", async (req: Request, res: Response) => {
    console.log(req)
    console.log(req.body)
    const email: string = req.body.email;
    const password: string = toHashed(req.body.password);

    try {
        const user: User | null = await UserRepository.findByEmailAndPassword(email, password);
        if (!user) {
            res.status(200).json({
                'userId': '',
                'userName': '',
                'message': 'メールアドレスかパスワードが間違っています。'
            });
            return;
        }

        const userWorkspaces = await WorkspaceRepository.findByUserId(user.userId);
        const userAuthorities = await AuthorityRepository.findByUserId(user.userId);

        // ログイン成功。
        req.session.userId = user.userId;
        req.session.userName = user.userName;
        req.session.workspaces = userWorkspaces ?? []
        req.session.authorities = userAuthorities ?? [];
        res.status(200).json({
            'userId': req.session.userId,
            'userName': req.session.userName,
            'workspaces': req.session.workspaces,
            'authorities': req.session.authorities,
        });
    } catch (err) {
        console.error(`メールアドレスとパスワードをキーにしてユーザー情報を取得する処理でエラーが発生しました：${err}`);
        res.status(500).json({
            'userId': '',
            'userName': '',
            'message': 'サーバーでエラーが発生しています。',
        })
    }
});

app.get("/account/logout", async (req: Request, res: Response) => {
    // ログアウト処理。
    req.session.destroy(() => { });
    res.redirect('/auth/status');
});

// ログイン状態を確認するエンドポイント
app.get('/auth/status', (req: Request, res: Response) => {
    if (req.session.userId) {
        res.status(200).json(
            {
                loggedIn: true,
                userId: req.session.userId,
                userName: req.session.userName,
                workspaces: req.session.workspaces,
                authorities: req.session.authorities,
            });
    } else {
        // トークンが無効またはユーザーが存在しない場合
        res.status(200).json({ loggedIn: false });
    }
});


app.post("/app-forms/me", async (req: Request, res: Response) => {
    if (!req.session.userId) {
        res.status(200).json({ loggedIn: false });
        return;
    }

    try {
        const searchOption: SearchOption = req.body.searchOptions;
        console.log(searchOption)
        const workspaceId: number = parseInt(req.body.workspaceId);
        console.log(`userId:${req.session.userId} workspaceId:${workspaceId}`);
        const appForms = await AppFormRepository.findBySearchOption(req.session.userId, workspaceId, searchOption);
        // const appForms = await AppFormRepository.findByUserIdAndWorkspaceId(req.session.userId, workspaceId);
        res.status(200).json(
            {
                loggedIn: true,
                appForms: appForms,
            });
    } catch (err) {
        res.status(500).json({
            loggedIn: true,
            'message': 'サーバーでエラーが発生しています。',
        })
    }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    // エラーの処理
    throw new Error(error.message);
});