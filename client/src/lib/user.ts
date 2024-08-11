export interface User {
    userId: number
    userName: string
    mailAddress: string
    password: string
    roles: number[]
}

const Role = {
    Member: 1,
    Approver: 2,
    Admin: 100
} as const;

export function isMember(user: User): boolean {
    return user.roles.includes(Role.Member);
}

export function isApprover(user: User): boolean {
    return user.roles.includes(Role.Approver);
}

export function isAdmin(user: User): boolean {
    return user.roles.includes(Role.Admin);
}