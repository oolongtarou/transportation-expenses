import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import AppFormTable from "./components/AppFormTable"
import { ApplicationForm, ApplicationStatuses, calculateTotalAmount } from "./app-form";
import { applicationFormSchema } from "../schema/app-form-schema";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getWorkspaceIdFrom } from "@/lib/user-workspace";
import axios, { AxiosError } from "axios";
import { hasWorkspaceAuthority, User } from "@/lib/user";
import { useEffect, useState } from "react";
import MessageBox from "@/components/MessageBox";
import AppFormStatus from "./components/AppFormStatus";
import { Authorities } from "@/lib/auth";
import { scrollToTop } from "@/lib/utils";

interface AppFormCreateProps {
    inputAppForm: ApplicationForm
    variant: AppFormVariant
}

type AppFormVariant = 'create' | 'review';

type SubmitType = 'draft' | 'makeSure' | 'fix';

const AppFormCreate = (props: AppFormCreateProps) => {
    const { inputAppForm, variant } = props;
    const navigate = useNavigate();
    const location = useLocation();
    const [appForm, setAppForm] = useState<ApplicationForm>(inputAppForm);
    const [applicationId, setApplicationId] = useState<number>(inputAppForm.applicationId);
    const [editing, setEditing] = useState<boolean>(variant === 'create');
    const [completed, setCompleted] = useState<boolean>(false);
    const [messageCode, setMessageCode] = useState<string | null>('');
    const [searchParams] = useSearchParams();
    const [user, setUser] = useState<User | null>(null);
    const currentWorkspaceId = getWorkspaceIdFrom(location.pathname);
    const methods = useForm<ApplicationForm>({
        mode: 'all',
        resolver: zodResolver(applicationFormSchema),
        defaultValues: appForm,
    });

    const onSubmit = async (data: ApplicationForm, submitType: SubmitType) => {
        if (submitType === 'draft') {
            const user = await axios.get<User>(`${import.meta.env.VITE_SERVER_DOMAIN}/auth/status`, { withCredentials: true });

            if (!user.data || !currentWorkspaceId) {
                navigate('/account/login?m=E00006');
                return;
            }

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
            const result = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/app-form/draft/save`, { appForm: appForm }, { withCredentials: true });
            if (result.status === 200) {
                setMessageCode(applicationId ? 'S00004' : 'S00003');
                setCompleted(true);
                setApplicationId(result.data.applicationId);
            } else if (result.status === 401) {
                navigate('/account/login?m=E00006');
            } else if (result.status === 500) {
                setMessageCode('E00001');
            } else {
                setMessageCode('E00005');
            }
        } else if (submitType === 'makeSure') {
            setEditing(false);
            scrollToTop();
        }
        else if (submitType === 'fix') {
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
            const result = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/app-form/new`, { appForm: appForm }, { withCredentials: true });
            if (result.status === 200) {
                setMessageCode('S00002');
                setCompleted(true);
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
        }
    };

    const deleteDraft = async () => {
        try {
            const result = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/app-form/draft/delete`, { applicationId: applicationId }, { withCredentials: true });
            if (result.status === 200) {
                setMessageCode('S00005');
                scrollToTop();
                setApplicationId(0);
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

    useEffect(() => {
        setMessageCode(searchParams.get('m'));
    }, [searchParams])

    useEffect(() => {
        const applicationIdQuery = searchParams.get('applicationId');
        if (applicationIdQuery) {
            axios.get<ApplicationForm>(`${import.meta.env.VITE_SERVER_DOMAIN}/app-form/review`, { params: { applicationId: searchParams.get('applicationId'), workspaceId: currentWorkspaceId }, withCredentials: true })
                .then(response => {
                    const data: ApplicationForm = response.data;

                    setAppForm(data);
                    methods.reset(data);  // フォームをリセットして新しい値を反映
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
            <h2 className="heading-2">
                {variant === "create"
                    ? editing ? '申請書を作成する' : '申請書の内容を確認する'
                    : '申請書の内容を確認する'
                }
            </h2>
            {variant === 'review'
                ? <section className="grid lg:grid-cols-2 mx-5 my-3" hidden={variant === 'review'}>
                    <div className="flex items-center mb-5">
                        <label className="font-bold text-lg w-40">申請書ID：</label>
                        <p className="text-lg">{appForm.applicationId}</p>
                    </div>
                    <div className="flex items-center mb-5">
                        <label className="font-bold text-lg w-40">申請者：</label>
                        <p className="text-lg">{appForm.user.userName}</p>
                    </div>
                    <div className="flex items-center mb-5">
                        <label className="font-bold text-lg w-40">申請日：</label>
                        <p className="text-lg">{new Date(appForm.applicationDate).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center mb-5">
                        <label className="font-bold text-lg w-40">ステータス：</label>
                        <AppFormStatus statusId={appForm.statusId} statusName={appForm.status.statusName} />
                    </div>
                </section>
                : null
            }
            <FormProvider {...methods}>
                <form>
                    <AppFormTable tableRows={appForm.details} editing={editing} watch={methods.watch} setValue={methods.setValue} />
                    <div className="flex justify-end gap-5 mt-5 mb-5">
                        {isCreating(variant, editing)
                            ? <>
                                {applicationId ? <Button type="button" onClick={deleteDraft} className="btn btn-danger">下書きを削除する</Button> : null}
                                <Button onClick={methods.handleSubmit((data) => onSubmit(data, 'draft'))} className="btn btn-outline-primary" >下書き保存する</Button>
                                <Button onClick={methods.handleSubmit((data) => onSubmit(data, 'makeSure'))} className="btn btn-primary">申請に進む</Button>
                            </>
                            : null
                        }

                        {isMakingSure(variant, editing, completed)
                            ? <Button onClick={methods.handleSubmit((data) => onSubmit(data, 'fix'))} className="btn btn-primary">申請を確定する</Button>
                            : null
                        }

                        {isCreateCompleted(variant, editing, completed)
                            ? <a href={`/w/${currentWorkspaceId}/app-form/create`} className="btn btn-primary">続けて申請書を作成する</a>
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
        </div>
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
function isMakingSure(variant: AppFormVariant, editing: boolean, completed: boolean): boolean {
    return variant === 'create' && !editing && !completed;
}

/**
 * 新規作成が完了しているかどうかを判定する関数
 *
 * @param {AppFormVariant} variant - 現在のフォームのバリアント（`create`や`edit`など）
 * @param {boolean} editing - フォームが編集モードかどうか
 * @param {boolean} completed - フォームの作成が完了しているかどうか
 * @return {boolean} - 新規作成モードで編集が完了しており、作成が完了している場合はtrue、それ以外はfalse
 */
function isCreateCompleted(variant: AppFormVariant, editing: boolean, completed: boolean): boolean {
    return variant === 'create' && !editing && completed;
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