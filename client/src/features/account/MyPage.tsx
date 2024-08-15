import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { getLabelByAuthorityId } from "@/lib/auth";
import { User } from "@/lib/user";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyPage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_SERVER_DOMAIN}/auth/status`, { withCredentials: true })
            .then((response) => {
                if (response.data.userId) {
                    setUser(response.data);
                } else {
                    console.error(response.data.message);
                    navigate('/');
                }
            })
            .catch((err: AxiosError) => {
                console.error(`サーバーエラーが発生しました：${err.code}`);
                navigate("/");
            });
    }, [navigate]);

    return (
        <div className="container max-w-3xl">
            <h2 className="heading-2">マイページ</h2>
            <div className="flex mb-5">
                <img src="/icons/default_user_icon.svg" className="w-32 h-32 btn-img btn-link" />
                <div className="ml-3 pr-5 max-w-2xl">
                    <div className="flex flex-row items-center">
                        <h3 className="font-bold text-xl mr-5">{user?.userName}</h3>
                        <img src="/icons/edit.svg" className="btn-img btn-link" />
                    </div>
                    <p className="text-pale-blue">{user?.mailAddress}</p>
                </div>
            </div>

            <div className="mb-5">
                <h3 className="font-bold text-2xl mb-2 ml-4">ワークスペース</h3>
                <Table className="bg-white mb-5">
                    <TableBody>
                        {!user
                            ? <></>
                            : user.workspaces.map(workspace => (
                                <TableRow key={workspace.workspaceId} className="flex justify-between items-center">
                                    <TableCell className="flex flex-row gap-3">
                                        <img src="/icons/default_workspace_icon.svg" className="btn-img btn-light" style={{ cursor: 'auto' }} />
                                        <div>
                                            <p className="text-black font-bold">{workspace.workspaceName}</p>
                                            <p>{user.authorities
                                                .filter(authority => authority.workspaceId === workspace.workspaceId)
                                                .map(authority => getLabelByAuthorityId(authority.authorityId)).join(', ')}</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}

                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-end gap-5 mb-5">
                <Button className="btn btn-light">パスワードを変更する</Button>
                <Button className="btn btn-danger">アカウントを削除する</Button>
            </div>
        </div >
    )
}

export default MyPage