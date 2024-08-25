export enum ApplicationStatus {
    Draft = 0,        // "下書き"
    Approving1 = 11,  // "承認中1"
    Approving2 = 12,  // "承認中1"
    Approving3 = 13,  // "承認中1"
    Approving4 = 14,  // "承認中1"
    Approving5 = 15,  // "承認中1"
    Receiving = 30,  // "受領待ち"
    Received = 31,     // "受領済み"
    Rejected = 50     // "却下"
}

export const statusesApproving = [ApplicationStatus.Approving1, ApplicationStatus.Approving2, ApplicationStatus.Approving3, ApplicationStatus.Approving4, ApplicationStatus.Approving5]