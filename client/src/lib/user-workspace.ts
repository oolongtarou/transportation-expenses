export interface Workspace {
    workspaceId: number
    workspaceName: string
    workspaceIcon?: File
}

export function getWorkspaceWithSmallestId(workspaces: Workspace[] | null): Workspace | null {
    if (!workspaces || workspaces.length === 0) {
        return null;
    }

    const workspaceWithSmallestId = workspaces.reduce((minWorkspace, currentWorkspace) => {
        return currentWorkspace.workspaceId < minWorkspace.workspaceId ? currentWorkspace : minWorkspace;
    }, workspaces[0]);

    return workspaceWithSmallestId;
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