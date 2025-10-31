import { Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { DatabaseService } from 'src/database/database.service'
import { PrismaService } from 'src/prisma.service'
import { TaskEntry } from 'src/task/models/task.model'

@Injectable()
export class TaskAdapter extends DatabaseService<TaskEntry> {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma.task, prisma, (client) => client.task)
    }

    async findTask(where: Record<string, unknown>): Promise<TaskEntry> {
        try {
            return await this.findEntry(where)
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException('TaskAdapter:findTask: No task found')
            }

            throw error
        }
    }

    async updateTaskById(
        where: Record<string, unknown>,
        data: Partial<TaskEntry>,
        transaction?: Prisma.TransactionClient
    ): Promise<TaskEntry> {
        try {
            return await this.updateEntry(where, data, transaction)
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException('TaskAdapter:updateTask: No task found')
            }

            throw error
        }
    }

    async deleteTaskById(where: Record<string, unknown>): Promise<TaskEntry> {
        try {
            return await this.deleteEntry(where)
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException('TaskAdapter:deleteTask: No task found')
            }

            throw error
        }
    }
}
