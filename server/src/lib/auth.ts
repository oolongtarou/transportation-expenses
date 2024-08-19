export interface Authority {
    workspaceId: number;
    authorityId: number;
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