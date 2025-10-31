import { Inject, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common'

import { TaskAdapter } from 'src/adapters/task.adapter'
import { UserAdapter } from 'src/adapters/user.adapter'
import type { CreateTaskRequestDto, TaskResponseDto, UpdateTaskRequestDto } from 'src/task/dto/task.dto'
import { TaskEntry } from 'src/task/models/task.model'

@Injectable()
export class TaskService {
    private readonly logger: Logger = new Logger(TaskService.name)

    @Inject() private readonly taskAdapter: TaskAdapter
    @Inject() private readonly userAdapter: UserAdapter

    async getAllTasks(): Promise<TaskResponseDto[]> {
        try {
            const tasks: TaskEntry[] = await this.taskAdapter.findEntries()

            const mappedTasks: TaskResponseDto[] = tasks.map((task) => ({
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                created_at: task.createdAt,
                updated_at: task.updatedAt,
                user_id: task.userId
            }))

            return mappedTasks
        } catch (error: unknown) {
            this.logger.error(error)
            throw new InternalServerErrorException(`Internal server error. Please try again.`)
        }
    }

    async createTask(body: CreateTaskRequestDto): Promise<TaskResponseDto> {
        try {
            const { title, description, userId } = body

            // Check if 'userId' is supplied and exists
            if (body.userId) await this.userAdapter.findUser({ id: body.userId })

            const newTask: TaskEntry = await this.taskAdapter.insertEntry({
                title,
                description,
                userId
            })

            const mappedNewTask: TaskResponseDto = {
                id: newTask.id,
                title: newTask.title,
                description: newTask.description,
                status: newTask.status,
                created_at: newTask.createdAt,
                updated_at: newTask.updatedAt,
                user_id: newTask.userId
            }

            console.info(`Task created with ID: ${newTask.id}`)

            return mappedNewTask
        } catch (error: unknown) {
            if (error instanceof NotFoundException) {
                this.logger.warn(error)
                throw new NotFoundException(
                    `Task cannot be associated with a user b'coz no user was found with ID: ${body.userId}.`
                )
            }

            this.logger.error(error)
            throw new InternalServerErrorException(`Internal server error. Please try again.`)
        }
    }

    async updateTask(id: number, body: UpdateTaskRequestDto): Promise<TaskResponseDto> {
        try {
            const updatedTask: TaskEntry = await this.taskAdapter.updateTaskById({ id }, body)

            const mappedUpdatedTask: TaskResponseDto = {
                id: updatedTask.id,
                title: updatedTask.title,
                description: updatedTask.description,
                status: updatedTask.status,
                created_at: updatedTask.createdAt,
                updated_at: updatedTask.updatedAt,
                user_id: updatedTask.userId
            }

            this.logger.log(`Task updated with ID: ${updatedTask.id}`)

            return mappedUpdatedTask
        } catch (error: unknown) {
            if (error instanceof NotFoundException) {
                this.logger.warn(error)
                throw new NotFoundException(`No task was found with ID: ${id}.`)
            }

            this.logger.error(error)
            throw new InternalServerErrorException(`Internal server error. Please try again.`)
        }
    }

    async deleteTask(id: number): Promise<Record<string, string>> {
        try {
            const { id: deletedId }: TaskEntry = await this.taskAdapter.deleteTaskById({ id })

            this.logger.log(`Task deleted with ID: ${deletedId}`)

            return { message: `Task with ID: ${deletedId} deleted successfully.` }
        } catch (error: unknown) {
            if (error instanceof NotFoundException) {
                this.logger.warn(error)
                throw new NotFoundException(`No task was found with ID: ${id}`)
            }

            this.logger.error(error)
            throw new InternalServerErrorException(`Internal server error. Please try again.`)
        }
    }

    async assignUserToTask(taskId: number, userId: number): Promise<TaskResponseDto> {
        try {
            const updatedTask: TaskEntry = await this.taskAdapter.transaction(async (transaction) => {
                // Check if 'userId' exists
                await this.userAdapter.findUser({ id: userId }, transaction)

                return this.taskAdapter.updateTaskById({ id: taskId }, { userId }, transaction)
            })

            const mappedUpdatedTask: TaskResponseDto = {
                id: updatedTask.id,
                title: updatedTask.title,
                description: updatedTask.description,
                status: updatedTask.status,
                created_at: updatedTask.createdAt,
                updated_at: updatedTask.updatedAt,
                user_id: updatedTask.userId
            }

            this.logger.log(`User with ID: ${userId} assigned to Task ID: ${taskId}`)

            return mappedUpdatedTask
        } catch (error: unknown) {
            if (error instanceof NotFoundException) {
                this.logger.warn(error)

                const message: string = error.message.includes('UserAdapter')
                    ? `Task cannot be associated with a user b'coz no user was found with ID: ${userId}.`
                    : `No task was found with ID: ${taskId}.`

                throw new NotFoundException(message)
            }

            this.logger.error(error)
            throw new InternalServerErrorException(`Internal server error. Please try again.`)
        }
    }
}
