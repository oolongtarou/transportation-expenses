import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import AppFormTable from "./components/AppFormTable"
import { appFormInitialData, ApplicationForm, ApplicationStatuses, calculateTotalAmount } from "./app-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import { applicationFormSchema } from "../schema/app-form-schema";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getWorkspaceIdFrom } from "@/lib/user-workspace";
import axios, { AxiosError } from "axios";
import { hasWorkspaceAuthority, User } from "@/lib/user";
import { useEffect, useState } from "react";
import MessageBox from "@/components/MessageBox";
import { Authorities } from "@/lib/auth";
import { scrollToTop } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import AppFormStatus from "./components/AppFormStatus";

interface AppFormCreateProps {
    inputAppForm: ApplicationForm
    variant: AppFormVariant
}

type AppFormVariant = 'create' | 'review';

type SubmitType = 'draft' | 'draftFix' | 'makeSure' | 'correct' | 'fix';

const AppFormCreate = (props: AppFormCreateProps) => {
    const { inputAppForm, variant } = props;
    const navigate = useNavigate();
    const location = useLocation();
    const [appForm, setAppForm] = useState<ApplicationForm>(inputAppForm);
    const [applicationId, setApplicationId] = useState<number>(inputAppForm.applicationId);
    const [editing, setEditing] = useState<boolean>(variant === 'create');
    const [messageCode, setMessageCode] = useState<string | null>('');
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const currentWorkspaceId = getWorkspaceIdFrom(location.pathname);
    const methods = useForm<ApplicationForm>({
        mode: 'all',
        resolver: zodResolver(applicationFormSchema),
        defaultValues: appForm,
    });
    const { register, formState: { errors } } = methods;

    const [isDraftSaveDialogOpen, setIsDraftSaveDialogOpen] = useState(false);
    const [isDraftDeleteDialogOpen, setIsDraftDeleteDialogOpen] = useState(false);
    const [isCreateFixDialogOpen, setIsCreateFixDialogOpen] = useState(false);


    const onSubmit = async (data: ApplicationForm, submitType: SubmitType) => {
        if (submitType === 'draft') {
            setIsDraftSaveDialogOpen(true);
        } else if (submitType === 'draftFix') {
            const user = await axios.get<User>(`${import.meta.env.VITE_SERVER_DOMAIN}/auth/status`, { withCredentials: true });

            if (!user.data || !currentWorkspaceId) {
                navigate('/account/login?m=E00006');
                return;
            }
            console.log(data);
            data.userId = user.data.userId;
            data.applicationId = applicationId;
            data.workspaceId = currentWorkspaceId;
            data.applicationDate = new Date().toLocaleString();
            data.totalAmount = calculateTotalAmount(data.details);
            data.statusId = 1;
            data.details = data.details.map((detail, index) => ({
                ...detail,
                id: index + 1,
            }));
            const appForm: ApplicationForm = data;

            try {
                const result = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/app-form/draft/save`, { appForm: appForm }, { withCredentials: true });
                if (result.status === 200) {
                    setMessageCode('S00003');
                    console.log(result.data);
                    setApplicationId(result.data.applicationId);
                    scrollToTop();
                } else if (result.status === 400) {
                    setMessageCode('E00007');
                    scrollToTop();
                } else if (result.status === 401) {
                    navigate('/account/login?m=E00006');
                } else if (result.status === 500) {
                    setMessageCode('E00001');
                    scrollToTop();
                } else {
                    setMessageCode('E00005');
                    scrollToTop();
                }
            } catch (err) {
                console.error(err)
                if (err instanceof AxiosError && err.response?.status) {
                    if (err.response.status === 400) {
                        setMessageCode('E00007');
                        scrollToTop();
                    } else if (err.response.status === 401) {
                        navigate('/account/login?m=E00006');
                    } else if (err.response.status === 500) {
                        setMessageCode('E00001');
                        scrollToTop();
                    } else {
                        setMessageCode('E00005');
                        scrollToTop();
                    }
                } else {
                    setMessageCode('E00005');
                    scrollToTop();
                }
            } finally {
                setIsDraftSaveDialogOpen(false);
            }
        } else if (submitType === 'makeSure') {
            setEditing(false);
            scrollToTop();
        } else if (submitType === 'correct') {
            setEditing(true);
            scrollToTop();
        } else if (submitType === 'fix') {
            const user = await axios.get<User>(`${import.meta.env.VITE_SERVER_DOMAIN}/auth/status`, { withCredentials: true });

            if (!user.data || !currentWorkspaceId) {
                navigate('/account/login?m=E00006');
                return;
            }

            data.userId = user.data.userId;
            data.workspaceId = currentWorkspaceId;
            data.applicationDate = new Date().toLocaleString();
            data.totalAmount = calculateTotalAmount(data.details);
            data.statusId = 1;
            data.details = data.details.map((detail, index) => ({
                ...detail,
                id: index + 1,
            }));
            const appForm: ApplicationForm = data;
            try {
                const result = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/app-form/new`, { appForm: appForm }, { withCredentials: true });
                if (result.status === 200) {
                    navigate(`/w/${currentWorkspaceId}/app-form/review?applicationId=${result.data.applicationId}&m=S00002`);
                } else if (result.status === 400) {
                    setMessageCode('E00007');
                } else if (result.status === 401) {
                    navigate('/account/login?m=E00006');
                } else if (result.status === 500) {
                    setMessageCode('E00001');
                } else {
                    setMessageCode('E00005');
                }
            } catch (err) {
                console.error(err)
                if (err instanceof AxiosError && err.response?.status) {
                    if (err.response.status === 400) {
                        setMessageCode('E00007');
                    } else if (err.response.status === 401) {
                        navigate('/account/login?m=E00006');
                    } else if (err.response.status === 500) {
                        setMessageCode('E00001');
                    } else {
                        setMessageCode('E00005');
                    }
                } else {
                    setMessageCode('E00005');
                }
            } finally {
                setIsCreateFixDialogOpen(false);
                scrollToTop();
            }
        }
    };

    const deleteDraft = async () => {
        try {
            const result = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/app-form/draft/delete`, { applicationId: applicationId }, { withCredentials: true });
            if (result.status === 200) {
                setMessageCode('S00005');
                setApplicationId(0);
                setAppForm(appFormInitialData);
                scrollToTop();
            } else if (result.status === 401) {
                navigate('/account/login?m=E00006');
            } else if (result.status === 500) {
                setMessageCode('E00001');
                scrollToTop();
            } else {
                setMessageCode('E00005');
                scrollToTop();
            }
        } catch (err: AxiosError | unknown) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 500) {
                    setMessageCode('E00001');
                    scrollToTop();
                    setApplicationId(0);
                } else if (err.response?.status === 401) {
                    navigate('/account/login?m=E00006');
                } else {
                    setMessageCode('E00005');
                    scrollToTop();
                }
            }
        }
    }

    /**
     *申請書を承認する
     *
     * @param {number} applicationId
     */
    const approve = async (applicationId: number) => {
        try {
            const result = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/app-form/approve`, { applicationId: applicationId, workspaceId: currentWorkspaceId }, { withCredentials: true });
            if (result.status === 200) {
                const applicationIdQuery = searchParams.get('applicationId');
                navigate(`${location.pathname}?applicationId=${applicationIdQuery}&m=S00006`);
                scrollToTop();
            } else {
                setMessageCode('E00005')
                scrollToTop();
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    navigate('/account/login?m=E00006');
                    scrollToTop();
                } else {
                    setMessageCode(err.response?.data.messageCode);
                    scrollToTop();
                }
            }
        }
    }

    /**
     *申請書を受領登録する
     *
     * @param {number} applicationId
     */
    const receive = async (applicationId: number) => {
        try {
            const result = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/app-form/receive`, { applicationId: applicationId, workspaceId: currentWorkspaceId }, { withCredentials: true });
            if (result.status === 200) {
                const applicationIdQuery = searchParams.get('applicationId');
                navigate(`${location.pathname}?applicationId=${applicationIdQuery}&m=S00007`);
                scrollToTop();
            } else {
                setMessageCode('E00005')
                scrollToTop();
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    navigate('/account/login?m=E00006');
                    scrollToTop();
                } else {
                    setMessageCode(err.response?.data.messageCode);
                    scrollToTop();
                }
            }
        } finally {
            setIsDraftDeleteDialogOpen(false);
        }
    }

    /**
     *申請書を却下する
     *
     * @param {number} applicationId
     */
    const reject = async (applicationId: number) => {
        try {
            const result = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/app-form/reject`, { applicationId: applicationId, workspaceId: currentWorkspaceId }, { withCredentials: true });
            if (result.status === 200) {
                const applicationIdQuery = searchParams.get('applicationId');
                navigate(`${location.pathname}?applicationId=${applicationIdQuery}&m=S00008`);
                scrollToTop();
            } else {
                setMessageCode('E00005')
                scrollToTop();
            }
        } catch (err) {
            if (err instanceof AxiosError) {
                if (err.response?.status === 401) {
                    navigate('/account/login?m=E00012');
                    scrollToTop();
                } else {
                    setMessageCode(err.response?.data.messageCode);
                    scrollToTop();
                }
            }
        }
    }

    /**
     *申請書をコピーする
    *
    * @param {number} applicationId
    */
    const copy = async (applicationId: number) => {
        navigate(`/w/${currentWorkspaceId}/app-form/create?copyFrom=${applicationId}`);
    }

    useEffect(() => {
        setMessageCode(searchParams.get('m'));
    }, [searchParams])

    useEffect(() => {
        if (variant === 'create') {
            setAppForm(appFormInitialData);
            setEditing(true);
        } else if (variant === 'review') {
            setEditing(false);
        }
    }, [variant])

    useEffect(() => {
        const applicationIdQuery = searchParams.get('applicationId');
        const copyFromQuery = searchParams.get('copyFrom');
        if (applicationIdQuery) {
            axios.get<ApplicationForm>(`${import.meta.env.VITE_SERVER_DOMAIN}/app-form/review`, { params: { applicationId: applicationIdQuery, workspaceId: currentWorkspaceId }, withCredentials: true })
                .then(response => {
                    const data: ApplicationForm = response.data;

                    setAppForm(data);
                    methods.reset(data);  // フォームをリセットして新しい値を反映
                    setApplicationId(data.applicationId);
                }).catch(err => {
                    if (err.response?.status === 500) {
                        setMessageCode('E00001');
                        setApplicationId(0);
                    } else if (err.response?.status === 401) {
                        navigate('/account/login?m=E00006');
                    } else {
                        setMessageCode('E00005');
                    }
                })
        } else if (copyFromQuery) {
            axios.get<ApplicationForm>(`${import.meta.env.VITE_SERVER_DOMAIN}/app-form/copy`, { params: { applicationId: copyFromQuery, workspaceId: currentWorkspaceId }, withCredentials: true })
                .then(response => {
                    const data: ApplicationForm = response.data;

                    setAppForm(data);
                    methods.reset(data);  // フォームをリセットして新しい値を反映
                    setMessageCode('S00009')
                }).catch(err => {
                    if (err instanceof AxiosError) {
                        if (err.response?.status === 401) {
                            navigate('/account/login?m=E00012');
                            scrollToTop();
                        } else {
                            setMessageCode(err.response?.data.messageCode);
                            scrollToTop();
                        }
                    }
                })
        } else {
            axios.get<User>(`${import.meta.env.VITE_SERVER_DOMAIN}/auth/status`, { withCredentials: true })
                .then(response => {
                    const user: User = response.data;
                    if (!user.userId) {
                        navigate('/account/login?m=E00006');
                    }

                    setUser(user);
                }).catch(err => {
                    if (err.response?.status === 500) {
                        setMessageCode('E00001');
                        setApplicationId(0);
                    } else if (err.response?.status === 401) {
                        navigate('/account/login?m=E00006');
                    } else {
                        setMessageCode('E00005');
                    }
                })

        }
    }, [currentWorkspaceId, searchParams, variant, methods, navigate]);

    useEffect(() => {
        axios.get<User>(`${import.meta.env.VITE_SERVER_DOMAIN}/auth/status`, { withCredentials: true })
            .then(response => {
                const user: User = response.data;
                if (!user.userId) {
                    navigate('/account/login?m=E00006');
                }

                setUser(user);
            }).catch(err => {
                if (err.response?.status === 500) {
                    setMessageCode('E00001');
                    setApplicationId(0);
                } else if (err.response?.status === 401) {
                    navigate('/account/login?m=E00006');
                } else {
                    setMessageCode('E00005');
                }
            })
    }, [navigate]);

    return (
        <div className="container">
            <MessageBox messageCode={messageCode} />
            <div className="flex justify-between items-center">
                <h2 className="heading-2">
                    {variant === "create"
                        ? editing ? '申請書を作成する' : '申請書の内容を確認する'
                        : '申請書の内容を確認する'
                    }
                </h2>
                {user && currentWorkspaceId && canPrint(variant, appForm, user, currentWorkspaceId)
                    ? <a href={`/w/${currentWorkspaceId}/app-form/print?applicationId=${appForm.applicationId}`} target="_blank" className="btn btn-light">印刷する</a>
                    : null
                }
            </div>
            <section className="grid lg:grid-cols-2 mx-5 my-3">
                {variant === 'review'
                    ? <>
                        <div className="flex items-center mb-5">
                            <label className="font-bold text-lg w-32">申請書ID：</label>
                            <p className="text-lg">{appForm.applicationId}</p>
                        </div>
                        <div className="flex items-center mb-5">
                            <label className="font-bold text-lg w-32">申請者：</label>
                            <p className="text-lg">{appForm.user.userName}</p>
                        </div>
                        <div className="flex items-center mb-5">
                            <label className="font-bold text-lg w-32">申請日：</label>
                            <p className="text-lg">{new Date(appForm.applicationDate).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center mb-5">
                            <label className="font-bold text-lg w-32">ステータス：</label>
                            <AppFormStatus statusId={appForm.statusId} statusName={appForm.status.statusName} />
                        </div>
                    </>
                    : null
                }
                <div className="flex items-center mb-5">
                    <label htmlFor="applicationTitle" className="font-bold text-lg w-32">タイトル：</label>
                    <div>
                        {variant === 'create'
                            ? <Input
                                type='text'
                                id="applicationTitle"
                                className="w-72"
                                defaultValue={appForm.title}
                                disabled={!editing}
                                {...register('title')}
                            />
                            : <p className="text-lg w-72 ">
                                {appForm.title}
                            </p>
                        }
                        {errors && errors.title?.message ? <p className="text-red-500">{errors.title.message}</p> : <></>}
                    </div>
                </div>

            </section>
            <FormProvider {...methods}>
                <form>
                    <AppFormTable tableRows={appForm.details} editing={editing} watch={methods.watch} setValue={methods.setValue} />
                    <div className="flex justify-end gap-5 mt-5 mb-5">
                        {user && canCopy(variant, appForm, user)
                            ? <Button type="button" onClick={() => copy(appForm.applicationId)} className="btn btn-outline-primary">申請書をコピーする</Button>
                            : null
                        }

                        {isCreating(variant, editing)
                            ? <>
                                {applicationId
                                    ? <>
                                        <Button type="button" onClick={() => setIsDraftDeleteDialogOpen(true)} className="btn btn-danger">下書きを削除する</Button>
                                        <AlertDialog open={isDraftDeleteDialogOpen} onOpenChange={setIsDraftDeleteDialogOpen}>
                                            <AlertDialogTrigger>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>下書きを削除しますか？</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        下書きを削除したら元に戻すことはできません。
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                                    <Button type="button" onClick={deleteDraft} className="btn btn-danger">削除する</Button>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </>
                                    : null}

                                <Button onClick={methods.handleSubmit((data) => onSubmit(data, 'draft'))} className="btn btn-outline-primary" >下書き保存する</Button>
                                <AlertDialog open={isDraftSaveDialogOpen} onOpenChange={setIsDraftSaveDialogOpen}>
                                    <AlertDialogTrigger>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>下書きとして保存しますか？</AlertDialogTitle>
                                            <AlertDialogDescription hidden>
                                                下書き保存するための確認ダイアログです。
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                            <AlertDialogAction onClick={methods.handleSubmit((data) => onSubmit(data, 'draftFix'))} className="btn btn-primary">保存する</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                <Button onClick={methods.handleSubmit((data) => onSubmit(data, 'makeSure'))} className="btn btn-primary">申請に進む</Button>
                            </>
                            : null
                        }

                        {isMakingSure(variant, editing)
                            ?
                            <>
                                <Button onClick={methods.handleSubmit((data) => onSubmit(data, 'correct'))} type="button" className="btn btn-light">入力をやり直す</Button>

                                <Button type="button" onClick={() => setIsCreateFixDialogOpen(true)} className="btn btn-primary">申請を確定する</Button>
                                <AlertDialog open={isCreateFixDialogOpen} onOpenChange={setIsCreateFixDialogOpen}>
                                    <AlertDialogTrigger>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>申請を確定しますか？</AlertDialogTitle>
                                            <AlertDialogDescription hidden>
                                                申請書の作成を完了するための確認ダイアログです。
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>キャンセル</AlertDialogCancel>
                                            <AlertDialogAction onClick={methods.handleSubmit((data) => onSubmit(data, 'fix'))} className="btn btn-primary">確定する</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </>
                            : null
                        }

                        {currentWorkspaceId && user && needApprove(appForm, user, currentWorkspaceId)
                            ?
                            <>
                                <Button type="button" onClick={() => reject(appForm.applicationId)} className="btn btn-danger">却下する</Button>
                                <Button type="button" onClick={() => approve(appForm.applicationId)} className="btn btn-primary">承認する</Button>
                            </>
                            : null
                        }

                        {user && needReceive(appForm, user)
                            ? <Button type="button" onClick={() => receive(appForm.applicationId)} className="btn btn-primary">受領する</Button>
                            : null
                        }
                    </div>
                </form>
            </FormProvider>
        </div >
    )
}

export default AppFormCreate


/**
 * 新規作成モードかどうかを判定する関数
 *
 * @param {AppFormVariant} variant - 現在のフォームのバリアント（`create`や`edit`など）
 * @param {boolean} editing - フォームが編集モードかどうか
 * @return {boolean} - 新規作成モードで編集中の場合はtrue、それ以外はfalse
 */
function isCreating(variant: AppFormVariant, editing: boolean): boolean {
    return variant === 'create' && editing;
}

/**
 * 確認中かどうかを判定する関数
 *
 * @param {AppFormVariant} variant - 現在のフォームのバリアント（`create`や`edit`など）
 * @param {boolean} editing - フォームが編集モードかどうか
 * @param {boolean} completed - フォームの作成が完了しているかどうか
 * @return {boolean} - 新規作成モードで編集が完了しておらず、まだ完了していない場合はtrue、それ以外はfalse
 */
function isMakingSure(variant: AppFormVariant, editing: boolean): boolean {
    return variant === 'create' && !editing;
}

/**
 * 自分が承認する必要のある申請書を開いているかどうかを判定する関数
 *
 * @param {ApplicationForm} appForm - 現在の申請書オブジェクト
 * @param {User} user - 現在ログインしているユーザー
 * @param {number} currentWorkspaceId - 現在のワークスペースのID
 * @return {boolean} - 承認が必要な申請書であればtrue、それ以外はfalse
 */
function needApprove(appForm: ApplicationForm, user: User, currentWorkspaceId: number): boolean {
    const isMyAppForm = appForm.userId === user.userId;
    const isApproving = appForm.statusId == ApplicationStatuses.APPROVING;
    const hasApprovalAuthority = hasWorkspaceAuthority(currentWorkspaceId, user.authorities, Authorities.APPROVAL);
    return !isMyAppForm && isApproving && hasApprovalAuthority;
}

/**
 * 自分が受領する必要のある申請書を開いているかどうかを判定する関数
 *
 * @param {ApplicationForm} appForm - 現在の申請書オブジェクト
 * @param {User} user - 現在ログインしているユーザー
 * @return {boolean} - 受領が必要な申請書であればtrue、それ以外はfalse
 */
function needReceive(appForm: ApplicationForm, user: User): boolean {
    const isMyAppForm = appForm.userId === user.userId;
    const isReceiving = appForm.statusId === ApplicationStatuses.RECEIVING;
    return isMyAppForm && isReceiving;
}

function canCopy(variant: AppFormVariant, appForm: ApplicationForm, user: User): boolean {
    const isMyAppForm = appForm.userId === user.userId;
    const isDraft = appForm.statusId === ApplicationStatuses.DRAFT;
    return variant === "review" && isMyAppForm && !isDraft;
}

function canPrint(variant: AppFormVariant, appForm: ApplicationForm, user: User, currentWorkspaceId: number): boolean {
    const canPrintAsMyself = appForm.userId === user.userId;
    const canPrintAsApprover = hasWorkspaceAuthority(currentWorkspaceId, user.authorities, Authorities.APPROVAL);
    return variant === 'review' && (canPrintAsMyself || canPrintAsApprover);
}