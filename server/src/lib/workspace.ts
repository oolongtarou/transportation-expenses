export interface Workspace {
    workspaceId: number;
    workspaceName: string;
}

export interface WorkspaceMember {
    userId: number;
    lastName: string;
    firstName: string;
    userName: string;
    email: string;
    workspaceId: number;
    authorityIds: number[];
}