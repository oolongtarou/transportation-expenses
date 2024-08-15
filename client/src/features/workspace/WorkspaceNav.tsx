import { Authorities, Authority, getAuthoritiesByWorkspaceId, useAuth } from "@/lib/auth";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface NavItem {
    label: string;
    imgPath: string;
    link: string;
    requiredAuthorities: number[]
}

const navItems: NavItem[] = [
    {
        label: '申請書を作成する',
        imgPath: '/icons/create_app_form.svg',
        link: '/w/:workspaceId/app-form/create',
        requiredAuthorities: [Authorities.APPLICATION],
    },
    {
        label: 'メンバー一覧',
        imgPath: '/icons/member_list.svg',
        link: '/w/:workspaceId/workspace/members',
        requiredAuthorities: [Authorities.APPLICATION],
    },
    {
        label: '申請一覧',
        imgPath: '/icons/hamburger.svg',
        link: '/w/:workspaceId/app-form/list/me?page=1',
        requiredAuthorities: [Authorities.APPLICATION],
    },
    {
        label: '承認一覧',
        imgPath: '/icons/approval_list.svg',
        link: '/w/:workspaceId/app-form/list/approval',
        requiredAuthorities: [Authorities.APPROVAL],
    },
    {
        label: '承認ルート',
        imgPath: '/icons/approval_route.svg',
        link: '/w/:workspaceId/workspace/approval-route',
        requiredAuthorities: [Authorities.APPLICATION, Authorities.APPROVAL, Authorities.ADMIN],
    },
    {
        label: 'ワークスペース設定',
        imgPath: '/icons/settings.svg',
        link: '/w/:workspaceId/workspace/setting',
        requiredAuthorities: [Authorities.ADMIN],
    },
];

const WorkspaceNav = () => {
    const { currentWorkspace, myAuthorities } = useAuth();
    const { workspaceId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();  // 現在のURLを取得
    const [filteredNavItems, setFilteredNavItems] = useState<NavItem[]>([]);

    useEffect(() => {
        const currentWorkspaceAuthorities: Authority[] = getAuthoritiesByWorkspaceId(myAuthorities, currentWorkspace?.workspaceId ?? 0);
        const currentAuthorityIds = currentWorkspaceAuthorities.map(authority => authority.authorityId);

        setFilteredNavItems(navItems.filter(navItem =>
            navItem.requiredAuthorities.some(id => currentAuthorityIds.includes(id))
        ));
    }, [currentWorkspace, myAuthorities]);


    const handleClick = (link: string) => {
        navigate(link.replace(':workspaceId', workspaceId ?? '0'));
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
                        {filteredNavItems?.map((navItem, index) => (
                            <li
                                key={index}
                                className={`flex flex-row btn btn-link ${navItem.link.includes(location.pathname) ? 'focus' : ''}`}
                                onClick={() => handleClick(navItem.link)}
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