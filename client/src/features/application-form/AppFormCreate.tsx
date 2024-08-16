import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import AppFormTable from "./components/AppFormTable"
import { ApplicationForm, calculateTotalAmount } from "./app-form";
import { applicationFormSchema } from "../schema/app-form-schema";
import { useLocation, useNavigate } from "react-router-dom";
import { getWorkspaceIdFrom } from "@/lib/user-workspace";
import axios from "axios";
import { User } from "@/lib/user";

interface AppFormCreateProps {
    appForm: ApplicationForm
}

const AppFormCreate = (props: AppFormCreateProps) => {
    const { appForm } = props;
    const navigate = useNavigate();
    const location = useLocation();
    const currentWorkspaceId = getWorkspaceIdFrom(location.pathname);
    const methods = useForm<ApplicationForm>({
        mode: 'all',
        resolver: zodResolver(applicationFormSchema),
        defaultValues: appForm,
    });
    const onSubmit = async (data: ApplicationForm, submitType: number) => {
        if (submitType === 1) {
            console.log('下書き保存する');
        } else if (submitType === 2) {
            console.log('申請に進む');



            const user = await axios.get<User>(`${import.meta.env.VITE_SERVER_DOMAIN}/auth/status`, { withCredentials: true });

            if (!user.data) {
                navigate('/');
                return;
            }

            if (!currentWorkspaceId) {
                navigate('/');
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
            await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/app-form/new`, { appForm: appForm }, { withCredentials: true });
        }
    };

    return (
        <div className="container">
            <h2 className="heading-2">申請書を作成する</h2>
            <FormProvider {...methods}>
                <form>
                    <AppFormTable tableRows={appForm.details} editing={true} watch={methods.watch} setValue={methods.setValue} />
                    <div className="flex justify-end gap-5 mt-5 mb-5">
                        <Button onClick={methods.handleSubmit((data) => onSubmit(data, 1))} className="btn btn-outline-primary" >下書き保存する</Button>
                        <Button onClick={methods.handleSubmit((data) => onSubmit(data, 2))} className="btn btn-primary">申請に進む</Button>
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

export default AppFormCreate