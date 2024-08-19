import { Skeleton } from "@/components/ui/skeleton";
import { Authorities, Authority, getAuthoritiesByWorkspaceId, useAuth } from "@/lib/auth";
import { getWorkspaceIdFrom } from "@/lib/user-workspace";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

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
        link: '/w/:workspaceId/app-form/list/approver',
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

interface WorkspaceNavProps {
    onToggleNav: () => void;
}

const WorkspaceNav = (props: WorkspaceNavProps) => {
    const { onToggleNav } = props;
    const { currentWorkspace, myAuthorities } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();  // 現在のURLを取得
    const currentWorkspaceId = getWorkspaceIdFrom(location.pathname);
    const [filteredNavItems, setFilteredNavItems] = useState<NavItem[]>([]);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        const currentWorkspaceAuthorities: Authority[] = getAuthoritiesByWorkspaceId(myAuthorities, currentWorkspaceId ?? 0);
        const currentAuthorityIds = currentWorkspaceAuthorities.map(authority => authority.authorityId);

        setFilteredNavItems(navItems.filter(navItem =>
            navItem.requiredAuthorities.some(id => currentAuthorityIds.includes(id))
        ));
        setLoading(false);

    }, [currentWorkspace, myAuthorities, currentWorkspaceId]);


    const handleClick = (link: string) => {
        navigate(link.replace(':workspaceId', currentWorkspaceId?.toString() ?? '0'));
    }

    return (
        <>
            <ul className="min-h-screen-custom py-5 pl-5 min-w-72">
                <li className="flex justify-between btn btn-link" onClick={onToggleNav} style={{ padding: '0px' }}>
                    <h2 className="font-bold text-lg ">{currentWorkspace?.workspaceName}</h2>
                    <button className="flex justify-center items-center">
                        <img src="/icons/arrow_back.svg" alt="" className="w-5 h-5" />
                    </button>
                </li>
                <li>
                    <ul className="mt-4 mx-2 flex flex-col gap-2">
                        {isLoading
                            ?
                            navItems.map(navItem =>
                                <li key={navItem.label} >
                                    <Skeleton className="h-8 w-full mb-3" />
                                </li>
                            )
                            : filteredNavItems?.map((navItem, index) => (
                                <li
                                    key={index}
                                    className={`flex flex-row btn btn-link ${navItem.link.replace(':workspaceId', currentWorkspaceId?.toString() ?? '').includes(location.pathname) ? 'focus' : ''}`}
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