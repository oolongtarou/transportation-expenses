import { ApplicationForm } from "../app-form"
import AppFormStatus from "./AppFormStatus"

interface AppFormHeaderProps {
    appForm: ApplicationForm;
    isPrint: boolean;
}

const AppFormHeader = (props: AppFormHeaderProps) => {
    const { appForm, isPrint } = props;
    return (
        <section className="grid lg:grid-cols-2 mx-5 my-3">
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
                {isPrint
                    ? <p>{appForm.status.statusName}</p>
                    : <AppFormStatus statusId={appForm.statusId} statusName={appForm.status.statusName} />
                }

            </div>
        </section>
    )
}

export default AppFormHeader