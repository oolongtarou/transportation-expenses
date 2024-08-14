import { Authorities, Authority, getAuthoritiesByWorkspaceId, useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface NavItem {
    index: number;
    label: string;
    imgPath: string;
    link: string;
    requiredAuthorities: number[]
}

const navItems: NavItem[] = [
    {
        index: 0,
        label: '申請書を作成する',
        imgPath: '/icons/create_app_form.svg',
        link: '/app-form/create',
        requiredAuthorities: [Authorities.APPLICATION],
    },
    {
        index: 1,
        label: 'メンバー一覧',
        imgPath: '/icons/member_list.svg',
        link: '/workspace/1/members',
        requiredAuthorities: [Authorities.APPLICATION],
    },
    {
        index: 2,
        label: '申請一覧',
        imgPath: '/icons/hamburger.svg',
        link: '/app-form/list/me?page=1',
        requiredAuthorities: [Authorities.APPLICATION],
    },
    {
        index: 3,
        label: '承認一覧',
        imgPath: '/icons/approval_list.svg',
        link: '/app-form/list/approval',
        requiredAuthorities: [Authorities.APPROVAL],
    },
    {
        index: 4,
        label: '承認ルート',
        imgPath: '/icons/approval_route.svg',
        link: '/workspace/1/approval-route',
        requiredAuthorities: [Authorities.APPLICATION, Authorities.APPROVAL, Authorities.ADMIN],
    },
    {
        index: 5,
        label: 'ワークスペース設定',
        imgPath: '/icons/settings.svg',
        link: '/workspace/:id/setting',
        requiredAuthorities: [Authorities.ADMIN],
    },
];

const WorkspaceNav = () => {
    const { currentWorkspace, myAuthorities } = useAuth();
    const navigate = useNavigate();
    const [focusedIndex, setFocusedIndex] = useState<number>(1);
    const [filteredNavItems, setFilteredNavItems] = useState<NavItem[]>([]);

    useEffect(() => {
        const currentWorkspaceAuthorities: Authority[] = getAuthoritiesByWorkspaceId(myAuthorities, currentWorkspace?.workspaceId ?? 0);
        const currentAuthorityIds = currentWorkspaceAuthorities.map(authority => authority.authorityId);

        setFilteredNavItems(navItems.filter(navItem =>
            navItem.requiredAuthorities.some(id => currentAuthorityIds.includes(id))
        ));
    }, [currentWorkspace, myAuthorities, filteredNavItems]);


    const handleClick = (index: number) => {
        setFocusedIndex(index);
        navigate(navItems[index].link);
    }

    return (
        <>
            <ul className="min-h-screen-custom py-5 pl-5 min-w-72">
                <li className="flex justify-between">
                    <h2 className="font-bold text-lg ">{currentWorkspace?.workspaceName}</h2>
                    <button onClick={() => { }} className="flex justify-center items-center">
                        <img src="/icons/arrow_back.svg" alt="" className="w-5 h-5" />
                    </button>
                </li>
                <li>
                    <ul className="mt-4 mx-2 flex flex-col gap-2">
                        {filteredNavItems?.map(navItem => (
                            <li
                                key={navItem.index}
                                className={`flex flex-row btn btn-link ${focusedIndex === navItem.index ? 'focus' : ''}`}
                                onClick={() => handleClick(navItem.index)}
                            >
                                <img src={navItem.imgPath} />
                                <span className="ml-2">{navItem.label}</span>
                            </li>
                        ))}
                    </ul>
                </li >
            </ul >
        </>
    )
}

export default WorkspaceNav