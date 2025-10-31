export type TaskEntry = {
    id: number
    title: string
    description: string | null
    status: 'todo' | 'in_progress' | 'completed'
    createdAt: Date
    updatedAt: Date
    userId: number | null
}
