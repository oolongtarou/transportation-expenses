import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import AppFormTable from "./components/AppFormTable"
import { ApplicationForm, calculateTotalAmount } from "./app-form";
import { applicationFormSchema } from "../schema/app-form-schema";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { getWorkspaceIdFrom } from "@/lib/user-workspace";
import axios from "axios";
import { User } from "@/lib/user";
import { useEffect, useState } from "react";
import MessageBox from "@/components/MessageBox";

interface AppFormCreateProps {
    appForm: ApplicationForm
    variant: AppFormVariant
}

type AppFormVariant = 'create' | 'review';

type SubmitType = 'draft' | 'makeSure' | 'fix';

const AppFormCreate = (props: AppFormCreateProps) => {
    const { appForm, variant } = props;
    const navigate = useNavigate();
    const location = useLocation();
    const [editing, setEditing] = useState<boolean>(variant === 'create');
    const [completed, setCompleted] = useState<boolean>(false);
    const [messageCode, setMessageCode] = useState<string | null>('');
    const [searchParams] = useSearchParams();
    const currentWorkspaceId = getWorkspaceIdFrom(location.pathname);
    const methods = useForm<ApplicationForm>({
        mode: 'all',
        resolver: zodResolver(applicationFormSchema),
        defaultValues: appForm,
    });
    const onSubmit = async (data: ApplicationForm, submitType: SubmitType) => {
        if (submitType === 'draft') {
            console.log('下書き保存する');

        } else if (submitType === 'makeSure') {
            setEditing(false);
            // ページの最上部にスクロール
            window.scrollTo({ top: 0, behavior: 'smooth' });
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
            } else if (result.status === 403) {
                navigate('/account/login?m=E00006');
            } else if (result.status === 500) {
                setMessageCode('E00001');
            } else {
                setMessageCode('E00005');
            }
        }
    };

    useEffect(() => {
        setMessageCode(searchParams.get('m'));
    }, [searchParams])

    return (
        <div className="container">
            <MessageBox messageCode={messageCode} />
            <h2 className="heading-2">
                {variant === "create"
                    ? editing ? '申請書を作成する' : '申請書の内容を確認する'
                    : '申請書の内容を確認する'
                }
            </h2>
            <FormProvider {...methods}>
                <form>
                    <AppFormTable tableRows={appForm.details} editing={editing} watch={methods.watch} setValue={methods.setValue} />
                    <div className="flex justify-end gap-5 mt-5 mb-5">
                        {variant === 'create' && editing
                            ?
                            <>
                                <Button onClick={methods.handleSubmit((data) => onSubmit(data, 'draft'))} className="btn btn-outline-primary" >下書き保存する</Button>
                                <Button onClick={methods.handleSubmit((data) => onSubmit(data, 'makeSure'))} className="btn btn-primary">申請に進む</Button>
                            </>
                            : !completed
                                ? <Button onClick={methods.handleSubmit((data) => onSubmit(data, 'fix'))} className="btn btn-primary">申請を確定する</Button>
                                : <a href={`/w/${currentWorkspaceId}/app-form/create`} className="btn btn-primary">続けて申請書を作成する</a>
                        }
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

export default AppFormCreate