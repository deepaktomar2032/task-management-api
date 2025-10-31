import { z } from 'zod'

// Request body for creating a user
export const CreateUserSchema = z.object({
    name: z.string(),
    email: z.email().max(255)
})

export type CreateUserRequestDto = z.infer<typeof CreateUserSchema>

// Response body for a user
export type UserResponseDto = {
    id: number
    name: string
    email: string
}
