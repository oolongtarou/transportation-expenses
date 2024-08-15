import { AuthContext } from "@/App";
import { useContext } from "react";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// 定数として権限IDを定義
export const Authorities = {
    APPLICATION: 1,
    APPROVAL: 2,
    ADMIN: 100,
} as const;

// 権限IDに対応するラベルを定義
export const AuthorityLabels: { [key in keyof typeof Authorities]: string } = {
    APPLICATION: "申請権限",
    APPROVAL: "承認権限",
    ADMIN: "管理者権限"
};

export const AuthorityArray = Object.keys(Authorities).map(key => ({
    authorityId: Authorities[key as keyof typeof Authorities],
    label: AuthorityLabels[key as keyof typeof Authorities]
}));

export interface Authority {
    workspaceId: number;
    authorityId: number;
}

export function getAuthoritiesByWorkspaceId(authorities: Authority[] | null, targetWorkspaceId: number): Authority[] {
    if (!authorities || authorities.length === 0) {
        return [];
    }

    const filteredAuthorities = authorities.filter(authority => authority.workspaceId === targetWorkspaceId);

    return filteredAuthorities.length > 0 ? filteredAuthorities : [];
}

// 権限IDからラベルを取得するための関数
export function getLabelByAuthorityId(authorityId: number): string | undefined {
    // Authoritiesオブジェクトのキーと値を逆にしてマッピングする
    const idToLabelMap = Object.entries(Authorities).reduce<{ [key: number]: string }>(
        (map, [key, value]) => {
            map[value] = AuthorityLabels[key as keyof typeof Authorities];
            return map;
        },
        {}
    );

    return idToLabelMap[authorityId];
}