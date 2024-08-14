export interface Workspace {
    workspaceId: number
    workspaceName: string
    workspaceIcon?: File
}

export function getFirstWorkspaceId(workspaces: Workspace[] | null): number | null {
    if (!workspaces || workspaces.length === 0) {
        return null;
    }

    return workspaces.reduce((minId, workspace) => {
        return workspace.workspaceId < minId ? workspace.workspaceId : minId;
    }, workspaces[0].workspaceId);
}

export function getWorkspaceById(workspaces: Workspace[] | null, targetId: number): Workspace | null {
    if (!workspaces || workspaces.length === 0) {
        return null;
    }

    const foundWorkspace = workspaces.find(workspace => workspace.workspaceId === targetId);

    return foundWorkspace || null;
}

export function getWorkspacesExcludingId(workspaces: Workspace[] | null, targetId: number): Workspace[] {
    if (!workspaces || workspaces.length === 0) {
        return [];
    }

    const filteredWorkspaces = workspaces.filter(workspace => workspace.workspaceId !== targetId);

    return filteredWorkspaces.length > 0 ? filteredWorkspaces : [];
}