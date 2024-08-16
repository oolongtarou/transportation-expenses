export enum ApplicationStatus {
    Draft = 0,        // "下書き"
    Approving = 1,  // "承認中"
    Receiving = 2,  // "受領待ち"
    Received = 3,     // "受領済み"
    Rejected = 10     // "却下"
}