interface WorkspaceNavProps {
    workspaceId: number
    workspaceName: string
}

const WorkspaceNav = (props: WorkspaceNavProps) => {
    const { workspaceName } = props;
    return (
        <>
            <ul className="max-w-72 min-h-screen shadow py-5 pl-5">
                <li className="flex justify-between">
                    <h2 className="font-bold text-lg ">{workspaceName}</h2>
                    <button onClick={() => { }} className="flex justify-center items-center">
                        <img src="./icons/arrow_back.svg" alt="" className="w-5 h-5" />
                    </button>
                </li>
                <li>
                    <ul className="mt-4 mx-2 flex flex-col gap-2">
                        <li className="flex flex-row btn btn-link focus">
                            <img src="./icons/create_app_form.svg" />
                            <a className="ml-2" href="#">申請書を作成する</a>
                        </li>
                        <li className="flex flex-row btn btn-link">
                            <img src="./icons/member_list.svg" />
                            <a className="ml-2" href="#">メンバー一覧</a>
                        </li>
                        <li className="flex flex-row btn btn-link">
                            <img src="./icons/hamburger.svg" />
                            <a className="ml-2" href="#">申請一覧</a>
                        </li>
                        <li className="flex flex-row btn btn-link">
                            <img src="./icons/approval_list.svg" />
                            <a className="ml-2" href="#">承認一覧</a>
                        </li>
                        <li className="flex flex-row btn btn-link">
                            <img src="./icons/approval_route.svg" />
                            <a className="ml-2" href="#">承認ルート</a>
                        </li>
                        <li className="flex flex-row btn btn-link">
                            <img src="./icons/settings.svg" />
                            <a className="ml-2" href="#">ワークスペース設定</a>
                        </li>
                    </ul>
                </li>
            </ul>
        </>
    )
}

export default WorkspaceNav