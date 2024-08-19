import { Authorities, Authority } from "./auth"
import { Workspace } from "./user-workspace"

export interface User {
    userId: number
    firstName: string
    lastName: string
    userName: string
    mailAddress: string
    password: string
    roles: number[]
    workspaces: Workspace[]
    authorities: Authority[]
}

export function isMember(user: User): boolean {
    return user.authorities.some(authority => authority.authorityId === Authorities.APPLICATION);
}

export function isApprover(user: User): boolean {
    return user.authorities.some(authority => authority.authorityId === Authorities.APPROVAL);
}

export function isAdmin(user: User): boolean {
    return user.authorities.some(authority => authority.authorityId === Authorities.ADMIN);
}


/**
 * authoritiesの中にtargetAuthorityがあるかどうかを返す(workspaceを考慮していない)
 *
 * @export
 * @param {Authority[]} authorities
 * @param {number} targetAuthority
 * @return {*}  {boolean}
 */
export function hasAuthority(authorities: Authority[], targetAuthority: number): boolean {
    return authorities.some(authority => authority.authorityId === targetAuthority);
}



/**
 * authoritiesの中に対象のworkspaceIdのtargetAuthorityがあるかどうかを返す
 *
 * @export
 * @param {number} workspaceId
 * @param {Authority[]} authorities
 * @param {number} targetAuthority
 * @return {*}  {boolean}
 */
export function hasWorkspaceAuthority(workspaceId: number, authorities: Authority[], targetAuthority: number): boolean {
    return authorities.some(auth => auth.workspaceId === workspaceId && auth.authorityId === targetAuthority);
}


// JSONオブジェクトをUser型の配列に変換する関数
export function ToWorkspaceMembers(data: RawUserData[]): User[] {
    return data.map(item => ({
        userId: item.userId,
        firstName: item.firstName,
        lastName: item.lastName,
        userName: item.userName,
        mailAddress: item.email,
        password: '', // パスワードは指定されていないので空にする
        roles: [], // rolesも指定されていないので空の配列にする
        workspaces: [{ workspaceId: item.workspaceId, workspaceName: '', approvalStep: 1 }], // workspaceIdをworkspacesフィールドに変換
        authorities: item.authorityIds.map(authorityId => ({
            workspaceId: item.workspaceId,
            authorityId
        }))
    }));
}

export interface RawUserData {
    userId: number;
    lastName: string;
    firstName: string;
    userName: string;
    email: string;
    workspaceId: number;
    authorityIds: number[];
}
