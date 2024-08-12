import { Button } from "@/components/ui/button"
import AppFormTable from "./components/AppFormTable"
import { ApplicationForm } from "./app-form";

interface AppFormCreateProps {
    appForm: ApplicationForm
}

const AppFormCreate = (props: AppFormCreateProps) => {
    const { appForm } = props;
    return (
        <div className="container">
            <h2 className="font-bold text-xl mx-5 my-3">申請書を作成する</h2>
            <AppFormTable tableRows={appForm.details} />
            <div className="flex justify-end gap-5 mt-5 mb-5">
                <Button className="btn btn-outline-primary" >下書き保存する</Button>
                <Button className="btn btn-primary" >申請する</Button>
            </div>
        </div>
    )
}

export default AppFormCreate