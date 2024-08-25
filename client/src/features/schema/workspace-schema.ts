import { z } from "zod"


export const workspaceSchema = z.object({
    workspaceName: z.string()
        .min(1, { message: 'ワークスペース名を入力してください' })
        .max(50, { message: '50字以内で入力してください' }),
    description: z.string()
        .max(50, { message: '50字以内で入力してください' }),
})

export type WorkspaceCreateFormData = z.infer<typeof workspaceSchema>

export type WorkspaceInfoChangeFormData = z.infer<typeof workspaceSchema>
