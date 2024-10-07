// 外部ライブラリ
import express, { application, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from 'body-parser';
import session from 'express-session';
import Redis from 'ioredis';
import RedisStore from 'connect-redis'

// 自作
import { toHashed } from "./lib/cipher";
import { UserRepository } from "./repositories/user-repository";
import rateLimit from "express-rate-limit";
import { WorkspaceRepository } from "./repositories/workspace-repository";
import { User } from "@prisma/client";
import { AuthorityRepository } from "./repositories/authority-repository";
import { AppFormRepository } from "./repositories/app-form-repository";
import { ApplicationForm, Approver, SearchOption, SignupFormData } from "./schema/post";
import { toNumber } from "./lib/converter";
import { ApplicationStatus, statusesApproving } from "./enum/app-form";
import { Authorities, Authority, hasAuthority, hasWorkspaceAuthority } from './lib/auth';
import { canApprove } from "./lib/app-form";


declare module 'express-session' {
    interface SessionData {
        userId: number;
        userName: string;
        firstName: string;
        lastName: string;
        mailAddress: string;
        workspaces: Workspace[];
        authorities: Authority[];
    }

    interface Workspace {
        workspaceId: number;
        workspaceName: string;
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
    max: 10000, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);

// app.set('trust proxy', 3);

app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
        proxy: true,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24,
    },
    store: new RedisStore({
        client: redisClient,
        disableTouch: false
    })
}));


// CORSの許可
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', process.env.CLIENT_DOMAIN)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true')
    next()
})

// form-urlencodedデータのパース
app.use(bodyParser.urlencoded({ extended: true }));

// JSONデータのパース
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
    res.status(200).send(process.env.NODE_ENV);
});

app.post("/account/login", async (req: Request, res: Response) => {
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
        req.session.firstName = user.firstName;
        req.session.lastName = user.lastName;
        req.session.mailAddress = user.email;
        req.session.workspaces = userWorkspaces ?? []
        req.session.authorities = userAuthorities ?? [];
        req.session.save((err) => {
            if (err) {
                console.error('セッションの保存に失敗しました:', err);

                return res.status(500).send('セッションの保存に失敗しました');
            }
            res.status(200).json({
                'userId': req.session.userId,
                'userName': req.session.userName,
                'workspaces': req.session.workspaces,
                'authorities': req.session.authorities,
            });
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

app.post("/account/signup", async (req: Request, res: Response) => {
    const signupFormData: SignupFormData = req.body.signFormData;

    const user = await UserRepository.findByEmail(signupFormData.email);
    if (user) {
        res.status(400).json({ messageCode: 'E00015' });
        return;
    }

    if (signupFormData.password !== signupFormData.confirmPassword) {
        res.status(400).json({ messageCode: 'E00016' });
        return;
    }

    if (signupFormData.firstName && signupFormData.lastName && signupFormData.userName && signupFormData.email && signupFormData.password) {
        const createdUser = await UserRepository.createUser(signupFormData);
        if (createdUser) {
            res.status(200).json(createdUser);
        } else {
            res.status(500).json({ messageCode: 'E00001' });
            return;
        }
    } else {
        res.status(400).json({ messageCode: 'E00017' });
        return;
    }
});

app.post("/account/password/change", async (req: Request, res: Response) => {
    if (!req.session.userId) {
        res.status(401).json({
            'messageCode': 'E00006',
        })
        return;
    }

    const currentPassword: string = req.body.currentPassword;
    const newPassword: string = req.body.newPassword;

    const user = await UserRepository.findByUserIdAndPassword(req.session.userId, currentPassword);
    if (!user) {
        res.status(400).json({ messageCode: 'E00025' });
        return;
    }

    const result = await UserRepository.udpatePassword(req.session.userId, newPassword);
    if (result) {
        res.status(200).json();
    } else {
        res.status(500).json({ messageCode: 'E00001' })
    }
});

app.post("/account/user-info/change", async (req: Request, res: Response) => {
    if (!req.session.userId) {
        res.status(401).json({
            'messageCode': 'E00006',
        })
        return;
    }

    const user: User = req.body.user;
    user.userId = req.session.userId;

    const userInfoInDB = await UserRepository.findById(user.userId);

    if (user.email !== userInfoInDB?.email && await UserRepository.findByEmail(user.email)) {
        res.status(401).json({
            'messageCode': 'E00015',
        })
        return;
    }

    if (user.userName !== userInfoInDB?.userName && await UserRepository.findByUserName(user.userName)) {
        res.status(401).json({
            'messageCode': 'E00026',
        })
        return;
    }

    const updatedUser = await UserRepository.udpateUserInfo(user);
    if (updatedUser) {
        req.session.userName = updatedUser.userName;
        req.session.firstName = updatedUser.firstName;
        req.session.lastName = updatedUser.lastName;
        req.session.mailAddress = updatedUser.email;
        req.session.save((err) => {
            if (err) {
                console.error('セッションの保存に失敗しました:', err);

                return res.status(500).json({ messageCode: 'E00001' })
            }
            res.redirect('/auth/status');
        });
    } else {
        res.status(500).json({ messageCode: 'E00001' })
    }
});

app.get("/account/delete", async (req: Request, res: Response) => {
    if (!req.session.userId) {
        res.status(401).json({
            'messageCode': 'E00006',
        })
        return;
    }

    try {
        await UserRepository.deleteUser(req.session.userId);
        res.redirect('/account/logout');
    } catch (err) {
        res.status(500).json({ messageCode: 'E00001' })
    }
})

// ログイン状態を確認するエンドポイント
app.get('/auth/status', (req: Request, res: Response) => {
    if (req.session.userId) {
        res.status(200).json(
            {
                loggedIn: true,
                userId: req.session.userId,
                userName: req.session.userName,
                firstName: req.session.firstName,
                lastName: req.session.lastName,
                mailAddress: req.session.mailAddress,
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
        searchOption.page = req.body.page;
        const workspaceId: number = parseInt(req.body.workspaceId);
        const appForms = await AppFormRepository.findBySearchOption(workspaceId, searchOption, req.session.userId);
        const count = await AppFormRepository.fetchCountBySearchOption(workspaceId, searchOption, req.session.userId);
        res.status(200).json(
            {
                loggedIn: true,
                appForms: appForms,
                count: count,
            });
    } catch (err) {
        res.status(500).json({
            loggedIn: true,
            'message': 'サーバーでエラーが発生しています。',
        })
    }
});

app.post("/app-forms/approver", async (req: Request, res: Response) => {
    if (!req.session.userId) {
        res.status(200).json({ loggedIn: false });
        return;
    }

    try {
        const searchOption: SearchOption = req.body.searchOptions;
        searchOption.page = req.body.page;
        const workspaceId: number = parseInt(req.body.workspaceId);
        const appForms = await AppFormRepository.findBySearchOption(workspaceId, searchOption);
        const count = await AppFormRepository.fetchCountBySearchOption(workspaceId, searchOption);
        res.status(200).json(
            {
                loggedIn: true,
                appForms: appForms,
                count: count,
            });
    } catch (err) {
        res.status(500).json({
            loggedIn: true,
            'message': 'サーバーでエラーが発生しています。',
        })
    }
});

app.post('/workspace/create', async (req: Request, res: Response) => {
    if (!req.session.userId) {
        return res.status(401).json({
            'messageCode': 'E00006',
        })
    }
    const { workspaceName, description } = req.body.data;

    try {
        const sameNameWorkspace = await WorkspaceRepository.findWorkspaceByName(workspaceName);
        if (sameNameWorkspace) {
            return res.status(400).json({ messageCode: 'E00027' })
        }

        const createdWorkspace = await WorkspaceRepository.createWorkspace(req.session.userId, workspaceName, description);
        const userWorkspaces = await WorkspaceRepository.findByUserId(req.session.userId);
        const userAuthorities = await AuthorityRepository.findByUserId(req.session.userId);
        req.session.workspaces = userWorkspaces ?? undefined;
        req.session.authorities = userAuthorities ?? undefined;
        res.status(200).json(createdWorkspace)
    } catch (err) {
        console.error(err);
        return res.status(500).json({ messageCode: 'E00001' })
    }
})

app.get('/workspace/member-list', async (req: Request, res: Response) => {
    const workspaceIdQuery = req.query.workspaceId;
    const workspaceId = toNumber(workspaceIdQuery);
    if (workspaceId) {
        const members = await WorkspaceRepository.findWorkspaceMembers(workspaceId);
        res.status(200).json(members);
    } else {
        res.status(500).json({
            loggedIn: true,
            'message': 'ワークスペースIDが不明です',
        })
    }

});

app.get('/workspace/approvers', async (req: Request, res: Response) => {
    const workspaceIdQuery = req.query.workspaceId;
    const workspaceId = toNumber(workspaceIdQuery);
    if (workspaceId) {
        try {
            const approvers = await WorkspaceRepository.findApproversBy(workspaceId);
            res.status(200).json(approvers);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                'message': 'サーバーでエラーが発生しています。',
            })
        }
    } else {
        res.status(200).json({
            loggedIn: true,
            'message': 'ワークスペースIDが不明です',
        })
    }
});

app.get('/workspace/settings', async (req: Request, res: Response) => {
    const workspaceIdQuery = req.query.workspaceId;
    const workspaceId = toNumber(workspaceIdQuery);
    if (workspaceId) {
        try {
            const approvers = await WorkspaceRepository.findWorkspaceInfoBy(workspaceId);
            res.status(200).json(approvers);
        } catch (err) {
            console.error(err);
            res.status(500).json({
                'messageCode': 'E00001',
            })
        }
    } else {
        res.status(200).json({
            loggedIn: true,
            'messageCode': 'E00010',
        })
    }
});

app.post('/workspace/settings/change', async (req: Request, res: Response) => {
    const workspaceId = req.body.workspaceId;
    const workspaceName = req.body.workspaceName;
    const description = req.body.description;
    if (workspaceId) {
        try {
            const sameNameWorkspace = await WorkspaceRepository.findWorkspaceByName(workspaceName);
            if (sameNameWorkspace && sameNameWorkspace.workspaceId != workspaceId) {
                return res.status(400).json({
                    'messageCode': 'E00027',
                })
            }

            const result = await WorkspaceRepository.updateWorkspace(workspaceId, workspaceName, description);

            if (req.session.userId) {
                const userWorkspace = await WorkspaceRepository.findByUserId(req.session.userId);
                req.session.workspaces = userWorkspace ?? undefined;
            }

            res.redirect('/auth/status');
        } catch (err) {
            res.status(500).json({
                'messageCode': 'E00001',
            })
        }
    } else {
        res.status(400).json({
            'messageCode': 'E00010',
        })
    }
});

app.post('/workspace/invite', async (req: Request, res: Response) => {
    const workspaceId = req.body.workspaceId;
    const email = req.body.email;

    if (!workspaceId) {
        res.status(400).json({
            'messageCode': 'E00018',
        })
        return;
    }

    if (!email) {
        res.status(400).json({
            'messageCode': 'E00019',
        })
        return;
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
        res.status(400).json({
            'messageCode': 'E00020',
        })
        return;
    }

    const userWorkspace = await WorkspaceRepository.findUserWorkspace(user.userId, workspaceId);
    if (userWorkspace) {
        res.status(400).json({
            'messageCode': 'E00021',
        })
        return;
    }


    try {
        await WorkspaceRepository.inviteUser(user.userId, workspaceId);
        res.status(200).json();
    } catch (err) {
        console.error(err);
        res.status(500).json({
            'messageCode': 'E00001',
        })
    }
})

app.post('/workspace/member/edit', async (req: Request, res: Response) => {
    if (!req.session.userId || !req.session.authorities) {
        res.status(401).json({
            'messageCode': 'E00006',
        })
        return;
    }

    const targetUserId = req.body.userId;
    const workspaceId = req.body.workspaceId;
    const authorities: number[] = req.body.authorities;

    if (!workspaceId) {
        res.status(400).json({
            'messageCode': 'E00018',
        })
        return;
    }

    if (!targetUserId) {
        res.status(400).json({
            'messageCode': 'E00022',
        })
        return;
    }


    if (!hasWorkspaceAuthority(workspaceId, req.session.authorities, Authorities.ADMIN)) {
        res.status(400).json({
            'messageCode': 'E00023',
        })
        return;
    }

    try {
        await AuthorityRepository.replaceAuthorities(targetUserId, workspaceId, authorities)
        res.status(200).json();
    } catch (err) {
        console.error(err);
        res.status(500).json({
            'messageCode': 'E00001',
        })
    }
})

app.post('/workspace/approval-route/change', async (req: Request, res: Response) => {
    const workspaceId: number = req.body.workspaceId;
    const approvalStep: number = req.body.approvalStep;
    const approvers: Approver[] = req.body.approvers;

    if (!workspaceId) {
        return res.status(400).json({
            'messageCode': 'E00018',
        })
    }

    if (approvalStep < 1 || 5 < approvalStep) {
        return res.status(400).json({ messageCode: 'E00030' });
    }

    try {
        const workspaceInfo = await WorkspaceRepository.findWorkspaceInfoBy(workspaceId);
        if (workspaceInfo && workspaceInfo.approvalStep !== approvalStep) {
            const applicationsApproving = await AppFormRepository.findApplicationsByWorkspaceAndStatus(workspaceId, statusesApproving);
            if (applicationsApproving.length > 0) {
                return res.status(400).json({ messageCode: 'E00029' });
            }
        }

        await WorkspaceRepository.updateWorkspaceApprovalStepAndApprovers(workspaceId, approvalStep, approvers);
        return res.status(200).json({ messageCode: 'S00016' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ messageCode: 'E00001' });
    }
})

app.delete("/workspace/delete", async (req: Request, res: Response) => {
    if (!req.session.userId || !req.session.authorities) {
        return res.status(401).json({
            'messageCode': 'E00006',
        })
    }

    const workspaceId = req.body.workspaceId;

    if (!hasWorkspaceAuthority(workspaceId, req.session.authorities, Authorities.ADMIN)) {
        return res.status(403).json({
            'messageCode': 'E00031',
        })
    }


    try {
        await WorkspaceRepository.deleteWorkspace(workspaceId);
        const userWorkspaces = await WorkspaceRepository.findByUserId(req.session.userId);
        req.session.workspaces = userWorkspaces ?? undefined;
        res.status(200).json(req.session.workspaces)
    } catch (err) {
        res.status(500).json({ messageCode: 'E00001' })
    }
})

app.get('/app-form/review', async (req: Request, res: Response) => {
    try {
        if (!req.session.userName) {
            res.status(401).json({
                'message': 'ログインしていません。',
            })
            return;
        }

        const workspaceIdQuery = req.query.workspaceId;
        const workspaceId = toNumber(workspaceIdQuery);

        const applicationIdQuery = req.query.applicationId;
        const applicationId = toNumber(applicationIdQuery);

        if (!workspaceId || !applicationId) {
            res.status(400).json({
                'message': 'パラメータが不足しています。',
            })
            return;
        }

        const appForm = await AppFormRepository.findBy(applicationId);
        res.status(200).json(appForm);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            'message': 'サーバーでエラーが発生しています。',
        })
    }
});

app.post('/app-form/new', async (req: Request, res: Response) => {
    try {
        if (!req.session.userName) {
            res.status(401).json({
                'message': 'ログインしていません。',
            })
            return;
        }
        const appForm: ApplicationForm = req.body.appForm;
        if (!appForm.user || !appForm.user.userName) {
            appForm.user = { userName: req.session.userName }
        }
        appForm.statusId = ApplicationStatus.Approving1;
        const savedAppForm = await AppFormRepository.createNewAppForm(appForm);
        res.status(200).json(savedAppForm);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            'message': 'サーバーでエラーが発生しています。',
        })
    }
});

app.post('/app-form/draft/save', async (req: Request, res: Response) => {
    try {
        if (!req.session.userName) {
            res.status(401).json({
                'message': 'ログインしていません。',
            })
            return;
        }
        const appForm: ApplicationForm = req.body.appForm;
        if (!appForm.user || !appForm.user.userName) {
            appForm.user = { userName: req.session.userName }
        }
        appForm.statusId = ApplicationStatus.Draft;

        if (appForm.applicationId) {
            const updatedAppForm = await AppFormRepository.updateDraft(appForm);
            res.status(200).json(updatedAppForm);
        } else {
            const savedAppForm = await AppFormRepository.saveDraft(appForm);
            res.status(200).json(savedAppForm);
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            'message': 'サーバーでエラーが発生しています。',
        })
    }
});


app.post('/app-form/draft/delete', async (req: Request, res: Response) => {
    try {
        if (!req.session.userName) {
            res.status(401).json({
                'message': 'ログインしていません。',
            })
            return;
        }

        const applicationId: number = req.body.applicationId;
        if (!applicationId) {
            res.status(400).json({
                'message': '削除対象の申請書IDが不明です。',
            })
            return;
        }

        const result = await AppFormRepository.deleteAppForm(applicationId);
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({
            'message': 'サーバーでエラーが発生しています。',
        })
    }
});

app.post('/app-form/approve', async (req: Request, res: Response) => {
    try {
        if (!req.session.userName) {
            res.status(401).json({
                'messageCode': 'E00006',
            })
            return;
        }

        const applicationId: number = req.body.applicationId;
        if (!applicationId) {
            res.status(400).json({
                'messageCode': 'E00009',
            })
            return;
        }

        const workspaceId: number = req.body.workspaceId;
        if (!workspaceId) {
            res.status(400).json({
                'messageCode': 'E00010',
            })
            return;
        }

        const appForm = await AppFormRepository.findBy(applicationId);
        if (!appForm) {
            res.status(400).json({
                'messageCode': 'E00011',
            })
            return;
        }

        // 承認していい申請書かどうかを確認する
        if (req.session.userId && req.session.authorities && appForm.userId !== req.session.userId && await canApprove(req.session.userId, workspaceId, appForm.statusId) && hasWorkspaceAuthority(workspaceId, req.session.authorities, Authorities.APPROVAL)) {
            const result = await AppFormRepository.approve(req.session.userId, applicationId);
            res.status(200).json(result);
        } else {
            res.status(403).json({
                'messageCode': `E00008`,
            })
            return;
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({
            'messageCode': 'E00001',
        })
    }
});

app.post('/app-form/reject', async (req: Request, res: Response) => {
    try {
        if (!req.session.userName) {
            res.status(401).json({
                'messageCode': 'E00006',
            })
            return;
        }

        const applicationId: number = req.body.applicationId;
        if (!applicationId) {
            res.status(400).json({
                'messageCode': 'E00009',
            })
            return;
        }

        const workspaceId: number = req.body.workspaceId;
        if (!workspaceId) {
            res.status(400).json({
                'messageCode': 'E00010',
            })
            return;
        }

        const appForm = await AppFormRepository.findBy(applicationId);
        if (!appForm) {
            res.status(400).json({
                'messageCode': 'E00011',
            })
            return;
        }

        // 却下していい申請書かどうかを確認する
        if (req.session.userId && req.session.authorities && appForm.userId !== req.session.userId && statusesApproving.includes(appForm.statusId) && hasWorkspaceAuthority(workspaceId, req.session.authorities, Authorities.APPROVAL)) {
            const result = await AppFormRepository.reject(req.session.userId, applicationId);
            res.status(200).json(result);
        } else {
            res.status(403).json({
                'messageCode': `E00012`,
            })
            return;
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({
            'messageCode': 'E00001',
        })
    }
});


app.post('/app-form/receive', async (req: Request, res: Response) => {
    try {
        if (!req.session.userName) {
            res.status(401).json({
                'messageCode': 'E00006',
            })
            return;
        }

        const applicationId: number = req.body.applicationId;
        if (!applicationId) {
            res.status(400).json({
                'messageCode': 'E00009',
            })
            return;
        }

        const workspaceId: number = req.body.workspaceId;
        if (!workspaceId) {
            res.status(400).json({
                'messageCode': 'E00010',
            })
            return;
        }

        const appForm = await AppFormRepository.findBy(applicationId);
        if (!appForm) {
            res.status(400).json({
                'messageCode': 'E00011',
            })
            return;
        }

        // 受領登録していい申請書かどうかを確認する
        if (appForm.userId === req.session.userId && appForm.statusId === ApplicationStatus.Receiving) {
            const result = await AppFormRepository.receive(req.session.userId, applicationId);
            res.status(200).json(result);
        } else {
            res.status(403).json({
                'messageCode': `E00012`,
            })
            return;
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            'messageCode': 'E00001',
        })
    }
});

app.get('/app-form/copy', async (req: Request, res: Response) => {
    try {
        if (!req.session.userName) {
            res.status(401).json({
                'messageCode': 'E00006',
            })
            return;
        }

        const applicationIdQuery = req.query.applicationId;
        const applicationId = toNumber(applicationIdQuery);
        if (!applicationId) {
            res.status(400).json({
                'messageCode': 'E00009',
            })
            return;
        }

        const workspaceIdQuery = req.query.workspaceId;
        const workspaceId = toNumber(workspaceIdQuery);
        if (!workspaceId) {
            res.status(400).json({
                'messageCode': 'E00010',
            })
            return;
        }

        const appForm = await AppFormRepository.findBy(applicationId);
        if (!appForm) {
            res.status(400).json({
                'messageCode': 'E00011',
            })
            return;
        }

        // コピーしていい申請書かどうかを確認する
        if (appForm.userId === req.session.userId && appForm.statusId !== ApplicationStatus.Draft) {
            appForm.applicationId = 0;
            appForm.applicationDate = '';
            appForm.statusId = -1;
            res.status(200).json(appForm);
        } else {
            res.status(403).json({
                'messageCode': `E00013`,
            })
            return;
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            'messageCode': 'E00001',
        })
    }
});

app.get('/app-form/print', async (req: Request, res: Response) => {
    try {
        if (!req.session.userName) {
            res.status(401).json({
                'messageCode': 'E00006',
            })
            return;
        }

        const applicationIdQuery = req.query.applicationId;
        const applicationId = toNumber(applicationIdQuery);
        if (!applicationId) {
            res.status(400).json({
                'messageCode': 'E00009',
            })
            return;
        }

        const workspaceIdQuery = req.query.workspaceId;
        const workspaceId = toNumber(workspaceIdQuery);
        if (!workspaceId) {
            res.status(400).json({
                'messageCode': 'E00010',
            })
            return;
        }

        const appForm = await AppFormRepository.findBy(applicationId);
        if (!appForm) {
            res.status(400).json({
                'messageCode': 'E00011',
            })
            return;
        }

        // 印刷していい申請書かどうかを確認する
        const canPrintAsMyself = appForm.userId === req.session.userId;
        const canPrintAsApprover = req.session.authorities
            && appForm.userId !== req.session.userId
            && appForm.workspaceId === workspaceId
            && hasWorkspaceAuthority(workspaceId, req.session.authorities, Authorities.APPROVAL);
        if (appForm.statusId !== ApplicationStatus.Draft && (canPrintAsMyself || canPrintAsApprover)) {
            res.status(200).json(appForm);
        } else {
            res.status(403).json({
                'messageCode': `E00014`,
            })
            return;
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            'messageCode': 'E00001',
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
