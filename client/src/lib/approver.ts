export interface Approver {
    userId: number;
    userName: string;
    approvalStep: number;
}

export interface WorkspaceApprovers {
    workspaceId: number;
    approvalStep: number;
    approvers: Approver[];
}