import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Workspace } from "@/lib/user-workspace";

interface MyPageProps {
    workspaces: Workspace[]
}

const MyPage = (props: MyPageProps) => {
    const { workspaces } = props;
    return (
        <div className="container max-w-6xl">
            <h2 className="heading-2">マイページ</h2>
            <div className="flex mb-5">
                <img src="./icons/default_user_icon.svg" className="w-32 h-32 btn-img btn-link" />
                <div className="ml-3 pr-5 max-w-2xl">
                    <div className="flex flex-row items-center">
                        <h3 className="font-bold text-xl mr-5">佐藤 蓮</h3>
                        <img src="./icons/edit.svg" className="btn-img btn-link" />
                    </div>
                    <p className="text-pale-blue">you@example.com</p>
                </div>
            </div>

            <div>
                <h3 className="font-bold text-xl mb-2">ワークスペース</h3>
                <Table className="table-mini bg-white mb-5">
                    <TableBody>
                        {workspaces.map(workspace => (
                            <TableRow key={workspace.workspaceId} className="flex justify-between items-center" style={{ cursor: 'pointer' }} >
                                <TableCell className="flex flex-row gap-3">
                                    <img src="./icons/default_workspace_icon.svg" className="btn-img btn-light" />
                                    <div>
                                        <p className="text-black font-bold">{workspace.workspaceName}</p>
                                        <p>{workspace.roleNameList.join(',')}</p>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <img src="./icons/arrow_forward.svg" />
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </div>
            <div className="flex justify-end gap-5">
                <Button className="btn btn-light">パスワードを変更する</Button>
                <Button className="btn btn-danger">アカウントを削除する</Button>
            </div>
        </div>
    )
}

export default MyPage