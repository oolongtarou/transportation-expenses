import { useEffect, useState } from "react";

import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { formatWithCommas } from "@/lib/math";
import { ApplicationForm, calculateTotalAmount } from "./app-form"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { getWorkspaceIdFrom } from "@/lib/user-workspace";
import MessageBox from "@/components/MessageBox";


/**
 * 申請書印刷画面のコンポーネント。
 * 印刷画面はA4サイズに収めることを第一としているので印刷画面以外で使いまわすことを想定していない。そのため細かくコンポーネント化もしない。
 * @return {*} 
 */
const AppFormPrint = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const currentWorkspaceId = getWorkspaceIdFrom(location.pathname);
    const [appForm, setAppForm] = useState<ApplicationForm | null>(null);
    const [messageCode, setMessageCode] = useState<string | null>('');

    useEffect(() => {
        const applicationIdQuery = searchParams.get('applicationId');
        if (applicationIdQuery) {
            axios.get<ApplicationForm>(`${import.meta.env.VITE_SERVER_DOMAIN}/app-form/print`, { params: { applicationId: applicationIdQuery, workspaceId: currentWorkspaceId }, withCredentials: true })
                .then(response => {
                    const data: ApplicationForm = response.data;
                    setAppForm(data);
                }).catch(err => {
                    if (err.response?.data.messageCode) {
                        setMessageCode(err.response?.data.messageCode)
                    } else {
                        setMessageCode('E00005');
                    }
                })
        } else {
            console.log('');
        }
    }, [navigate, currentWorkspaceId, searchParams])

    // クエリ文字列で申請書IDを受け取ってAPIで申請書データを取得する。
    return (
        <>
            <MessageBox messageCode={messageCode} />
            {!appForm
                ? null
                : <div className="w-[750px] mx-auto">
                    < header className="flex justify-between items-center" >
                        <h2 className="heading-2">{appForm.title}</h2>
                        <p className="text-lg">出力日：{new Date().toLocaleDateString()}</p>
                    </header >
                    <main>
                        <section className="grid grid-cols-2 mx-5">
                            <div className="flex items-center mb-2">
                                <label className="font-bold text-lg w-40">申請書ID：</label>
                                <p className="text-lg">{appForm.applicationId}</p>
                            </div>
                            <div className="flex items-center mb-2">
                                <label className="font-bold text-lg w-40">申請者：</label>
                                <p className="text-lg">{appForm.user.userName}</p>
                            </div>
                            <div className="flex items-center mb-2">
                                <label className="font-bold text-lg w-40">申請日：</label>
                                <p className="text-lg">{new Date(appForm.applicationDate).toLocaleDateString()}</p>
                            </div>
                            <div className="flex items-center mb-2">
                                <label className="font-bold text-lg w-40">ステータス：</label>
                                <p>{appForm.status.statusName}</p>
                            </div>
                        </section>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[110px] pb-0">日付</TableHead>
                                    <TableHead className="w-[100px] pb-0">説明</TableHead>
                                    <TableHead className="w-[100px] px-0 pb-0 text-center">移動手段</TableHead>
                                    <TableHead className="w-[225px] px-0 pb-0">経路</TableHead>
                                    <TableHead className="w-[75px] px-0 pb-0 text-right">片道金額</TableHead>
                                    <TableHead className="w-[50px] px-0 pb-0 text-right">往復</TableHead>
                                    <TableHead className="w-[75px] px-0 pb-0 text-right">金額</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {appForm.details?.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="py-2">{row.date}</TableCell>
                                        <TableCell className="pr-0 py-2">{row.description}</TableCell>
                                        <TableCell className="px-0 py-2 text-center">{row.transportationName}</TableCell>
                                        <TableCell className="px-0 py-2">
                                            {row.routes?.map((route, index) => (
                                                <div key={index}>
                                                    {route.departureName} - {route.arrivalName} ({route.lineName})
                                                </div>
                                            ))}
                                        </TableCell>
                                        <TableCell className="text-right px-0 py-2">{formatWithCommas(row.oneWayAmount)}</TableCell>
                                        <TableCell className="text-right px-0 py-2">
                                            {row.isRoundTrip ? "往復" : "片道"}
                                        </TableCell>
                                        <TableCell className="text-right px-0 py-2">{formatWithCommas(row.detailAmount)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableCell colSpan={5} className="font-bold text-lg">合計金額</TableCell>
                                    <TableCell colSpan={2} className="text-right pr-0 font-bold text-lg">¥{formatWithCommas(calculateTotalAmount(appForm.details))}</TableCell>
                                    <TableCell colSpan={2}></TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </main>
                </div >
            }
        </>
    )
}

export default AppFormPrint