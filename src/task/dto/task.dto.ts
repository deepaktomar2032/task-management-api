import { z } from 'zod'

// Request body for creating a task
export const CreateTaskSchema = z
    .object({
        title: z.string(),
        description: z.string().max(500).nullable().optional(),
        user_id: z.number().min(1).nullable().optional()
    })
    .transform((data) => ({
        title: data.title,
        description: data.description === undefined ? null : data.description,
        userId: data.user_id === undefined ? null : data.user_id
    }))

export type CreateTaskRequestDto = z.infer<typeof CreateTaskSchema>

// Request body for updating a task
export const UpdateTaskSchema = z
    .object({
        title: z.string().optional(),
        description: z.string().max(500).optional(),
        status: z.enum(['todo', 'in_progress', 'completed']).optional()
    })
    .transform((data) => {
        const transformed = {
            title: data.title,
            description: data.description,
            status: data.status
        }

        // Filter out undefined properties
        return Object.fromEntries(Object.entries(transformed).filter(([, value]) => value !== undefined))
    })

export type UpdateTaskRequestDto = z.infer<typeof UpdateTaskSchema>

// Request body for assigning a user to a task
export const AssignUserSchema = z
    .object({
        user_id: z.number().min(1)
    })
    .transform((data) => ({
        userId: data.user_id
    }))

export type AssignUserRequestDto = z.infer<typeof AssignUserSchema>

// Response body for a task
export type TaskResponseDto = {
    id: number
    title: string
    description: string | null
    status: 'todo' | 'in_progress' | 'completed'
    created_at: Date
    updated_at: Date
    user_id: number | null
}
