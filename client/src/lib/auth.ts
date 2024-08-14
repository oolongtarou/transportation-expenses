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
