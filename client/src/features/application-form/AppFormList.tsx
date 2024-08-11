import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

import AppListTable from "./components/AppListTable"
import { ApplicationForm } from "./app-form"

const dummyApplicationForms: ApplicationForm[] = [
    {
        applicationId: 1,
        applicationDate: new Date('2024-08-01'),
        userId: 1001,
        userName: '山田 太郎',
        totalAmount: 15000,
        applicationStatus: 1,
        applicationStatusName: '下書き',
        details: [],
    },
    {
        applicationId: 2,
        applicationDate: new Date('2024-08-02'),
        userId: 1002,
        userName: '鈴木 次郎',
        totalAmount: 23000,
        applicationStatus: 2,
        applicationStatusName: '承認中',
        details: [],
    },
    {
        applicationId: 3,
        applicationDate: new Date('2024-08-03'),
        userId: 1003,
        userName: '佐藤 花子',
        totalAmount: 17500,
        applicationStatus: 3,
        applicationStatusName: '受領待ち',
        details: [],
    },
    {
        applicationId: 4,
        applicationDate: new Date('2024-08-04'),
        userId: 1004,
        userName: '田中 一郎',
        totalAmount: 12000,
        applicationStatus: 4,
        applicationStatusName: '受領済み',
        details: [],
    },
    {
        applicationId: 5,
        applicationDate: new Date('2024-08-05'),
        userId: 1005,
        userName: '高橋 三郎',
        totalAmount: 20000,
        applicationStatus: 5,
        applicationStatusName: '却下',
        details: [],
    },
];

const AppFormList = () => {
    return (
        <div className="container">
            <header>
                <h2 className="font-bold text-3xl mb-5">申請一覧</h2>
                <section className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                        <Label htmlFor="applicationId">申請書ID</Label>
                        <Input id="applicationId" placeholder="12345" className="mt-1" />
                    </div>
                    <div>
                        <Label htmlFor="applicationDate">申請日</Label>
                        <Input id="applicationDate" placeholder="12345" className="mt-1" />
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
                        <Select>
                            <SelectTrigger id="applicationStatus" className="min-w-[80px] mt-1">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="0">下書き</SelectItem>
                                    <SelectItem value="1">承認中</SelectItem>
                                    <SelectItem value="2">受領待ち</SelectItem>
                                    <SelectItem value="3">受領済み</SelectItem>
                                    <SelectItem value="4">却下</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </section>
                <div className="flex flex-row justify-end gap-5 mb-5">
                    <Button className="btn btn-light w-24">クリア</Button>
                    <Button className="btn btn-primary w-24">検索</Button>
                </div>
                <AppListTable appForms={dummyApplicationForms} className="mb-3" />
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
            </header>
            <main>

            </main>
        </div>
    )
}

export default AppFormList