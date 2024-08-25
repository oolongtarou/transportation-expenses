import { ApplicationStatus } from "../enum/app-form";
import { AuthorityRepository } from "../repositories/authority-repository";

export const getStatusIdAfterApprove = (currentStatusId: number, approvalStep: number): number => {
    switch (currentStatusId) {
        case ApplicationStatus.Approving1:
            if (approvalStep <= 1) {
                return ApplicationStatus.Receiving;
            } else {
                return ApplicationStatus.Approving2;
            }
        case ApplicationStatus.Approving2:
            if (approvalStep <= 2) {
                return ApplicationStatus.Receiving;
            } else {
                return ApplicationStatus.Approving3;
            }
        case ApplicationStatus.Approving3:
            if (approvalStep <= 3) {
                return ApplicationStatus.Receiving;
            } else {
                return ApplicationStatus.Approving4;
            }
        case ApplicationStatus.Approving4:
            if (approvalStep <= 4) {
                return ApplicationStatus.Receiving;
            } else {
                return ApplicationStatus.Approving5;
            }
        case ApplicationStatus.Approving5:
            if (approvalStep <= 5) {
                return ApplicationStatus.Receiving;
            } else {
                return ApplicationStatus.Receiving;
            }
        default:
            throw new Error('どのステータスに更新すればよいのかが不明です。');
    }
}


export const canApprove = async (userId: number, workspaceId: number, currentStatusId: number): Promise<boolean> => {
    if (await AuthorityRepository.findApprovalAuthority(userId, workspaceId, currentStatusId)) {
        return true;
    } else {
        return false;
    }
}