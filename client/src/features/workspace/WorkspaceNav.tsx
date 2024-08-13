import { useState } from "react";

interface WorkspaceNavProps {
    workspaceId: number
    workspaceName: string
}

interface NavItem {
    label: string;
    imgPath: string;
    link: string;
}

const navItems: NavItem[] = [
    {
        label: '申請書を作成する',
        imgPath: '/icons/create_app_form.svg',
        link: '#',
    },
    {
        label: 'メンバー一覧',
        imgPath: '/icons/member_list.svg',
        link: '#',
    },
    {
        label: '申請一覧',
        imgPath: '/icons/hamburger.svg',
        link: '#',
    },
    {
        label: '承認一覧',
        imgPath: '/icons/approval_list.svg',
        link: '#',
    },
    {
        label: '承認ルート',
        imgPath: '/icons/approval_route.svg',
        link: '#',
    },
    {
        label: 'ワークスペース設定',
        imgPath: '/icons/settings.svg',
        link: '#',
    },
];

const WorkspaceNav = (props: WorkspaceNavProps) => {
    const { workspaceName } = props;
    const [focusedIndex, setFocusedIndex] = useState<number>(0);

    const handleClick = (index: number) => {
        setFocusedIndex(index);
    }

    return (
        <>
            <ul className="min-h-screen-custom py-5 pl-5 min-w-72">
                <li className="flex justify-between">
                    <h2 className="font-bold text-lg ">{workspaceName}</h2>
                    <button onClick={() => { }} className="flex justify-center items-center">
                        <img src="/icons/arrow_back.svg" alt="" className="w-5 h-5" />
                    </button>
                </li>
                <li>
                    <ul className="mt-4 mx-2 flex flex-col gap-2">
                        {navItems.map((navItem, index) => (
                            <li
                                key={index}
                                className={`flex flex-row btn btn-link ${focusedIndex === index ? 'focus' : ''}`}
                                onClick={() => handleClick(index)}
                            >
                                <img src={navItem.imgPath} />
                                <a className="ml-2" href="#">{navItem.label}</a>
                            </li>
                        ))}
                    </ul>
                </li >
            </ul >
        </>
    )
}

export default WorkspaceNav