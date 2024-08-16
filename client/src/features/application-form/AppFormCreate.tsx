import { Button } from "@/components/ui/button"
import AppFormTable from "./components/AppFormTable"
import { ApplicationForm } from "./app-form";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

interface AppFormCreateProps {
    appForm: ApplicationForm
}

const AppFormCreate = (props: AppFormCreateProps) => {
    const { appForm } = props;
    const [editing, setEditing] = useState<boolean>(true);
    const methods = useForm<ApplicationForm>();
    // const { watch, setValue } = methods;
    const onSubmit = (data: ApplicationForm) => {
        console.log(data); // 全データがここに集まります
    };

    // const reviewAppForm = () => {
    //     setEditing(false);
    //     // ページの最上部にスクロール
    //     window.scrollTo({ top: 0, behavior: 'smooth' });
    // };

    return (
        <div className="container">
            <h2 className="heading-2">
                {editing ? '申請書を作成する' : 'この内容で申請する'}
            </h2>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)}>
                    <AppFormTable tableRows={appForm.details} editing={editing} watch={methods.watch} setValue={methods.setValue} />
                    <div className="flex justify-end gap-5 mt-5 mb-5">
                        <Button className="btn btn-outline-primary" >下書き保存する</Button>
                        <Button type="submit" className="btn btn-primary" >申請する</Button>
                        {/* {editing
                            ? <>
                                <Button className="btn btn-outline-primary" >下書き保存する</Button>
                                <Button onClick={reviewAppForm} className="btn btn-primary" >申請する</Button>
                            </>
                            : <>
                                <Button onClick={() => setEditing(true)} className="btn btn-light" >内容を修正する</Button>
                                <Button className="btn btn-primary" >申請を確定する</Button>
                            </>
                        } */}
                    </div>
                </form>
            </FormProvider>
        </div>
    )
}

export default AppFormCreate