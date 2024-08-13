import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import AppListTable from "./components/AppListTable"
import { ApplicationForm, statusSelectOptions } from "./app-form"
import { MultiSelectBox } from "@/components/SelectBox"
import axios from "axios"
import { useState } from "react"



const AppFormList = () => {
    const [appForms, setAppForms] = useState<ApplicationForm[]>([]);

    const fetchAppForms = async () => {
        const res = await axios.post(`${import.meta.env.VITE_SERVER_DOMAIN}/app-forms/me`, { workspaceId: 1 }, { withCredentials: true })
        console.log(res.data);

        const fetchedAppForms: ApplicationForm[] = res.data.appForms;
        console.log(fetchedAppForms)
        setAppForms(fetchedAppForms);
    };

    return (
        <div className="container">
            <header>
                <h2 className="heading-2">申請一覧</h2>
                <section className="grid md:grid-cols-2 gap-4 mb-5">
                    <div>
                        <Label htmlFor="applicationId">申請書ID</Label>
                        <Input id="applicationId" placeholder="12345" className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="startDate">申請日</Label>
                        <div className="flex flex-row items-center gap-3 mt-1">
                            <Input type="date" id="startDate" placeholder="12345" />
                            <span>～</span>
                            <Input type="date" id="endDate" placeholder="12345" />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="userName">申請者名</Label>
                        <Input id="userName" placeholder="12345" className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="totalAmountMin">金額</Label>
                        <div className="flex flex-row items-center gap-3 mt-1">
                            <Input id="totalAmountMin" placeholder="12345" />
                            <span>～</span>
                            <Input id="totalAmountMax" placeholder="12345" />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="applicationStatus">申請書ステータス</Label>
                        <MultiSelectBox options={statusSelectOptions} onChange={() => { }} />
                    </div>
                </section>
                <div className="flex flex-row justify-end gap-5 mb-5">
                    <Button className="btn btn-light w-24">クリア</Button>
                    <Button onClick={fetchAppForms} className="btn btn-primary w-24">検索</Button>
                </div>
            </header>
            <main>
                <AppListTable appForms={appForms} className="mb-3" />
                <Pagination>
                    <PaginationContent >
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">1</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">2</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">3</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">4</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink href="#">5</PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationNext href="#" />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </main>
        </div>
    )
}

export default AppFormList