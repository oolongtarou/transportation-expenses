import { AuthContext } from "@/App";
import { useContext } from "react";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};


export interface Authority {
    workspaceId: number;
    authorityId: number;
}