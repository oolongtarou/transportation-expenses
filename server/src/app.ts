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


declare module 'express-session' {
    interface SessionData {
        userId: number;
        userName: string;
    }
}

// アプリケーションで動作するようにdotenvを設定する
dotenv.config();
const app = express();

const redisUrl: string = process.env.REDIS_URL || 'redis://localhost:6379';
const redisClient = new Redis(redisUrl, {
    password: process.env.REDIS_PASSWORD,
});

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

app.post("/account/login", (req: Request, res: Response) => {
    console.log(req)
    console.log(req.body)
    const email: string = req.body.email;
    const password: string = toHashed(req.body.password);
    UserRepository.findByEmailAndPassword(email, password)
        .then(user => {
            if (user == null) {
                res.status(200).json({
                    'userId': '',
                    'userName': '',
                    'message': 'メールアドレスかパスワードが間違っています。'
                });
            } else {
                // ログイン成功。
                req.session.userId = user.userId;
                req.session.userName = user.userName;

                res.status(200).json({
                    'userId': req.session.userId,
                    'userName': req.session.userName,
                });
            }
        })
        .catch(err => {
            console.error(`メールアドレスとパスワードをキーにしてユーザー情報を取得する処理でエラーが発生しました：${err}`);
            res.status(500).json({
                'userId': '',
                'userName': '',
                'message': 'サーバーでエラーが発生しています。',
            })
        })
});

app.get("/account/logout", async (req: Request, res: Response) => {
    // ログアウト処理。
    req.session.destroy(() => { });
    res.redirect('/');
});

app.get("/users", async (req: Request, res: Response) => {
    try {
        const allUsers = await prisma.user.findMany();
        console.log(allUsers);
        res.send(allUsers)
    } catch (err) {
        console.log(err)
        res.send(err)
    }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Server running at PORT: ", PORT);
}).on("error", (error) => {
    // エラーの処理
    throw new Error(error.message);
});