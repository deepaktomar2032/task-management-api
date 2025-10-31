import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { Prisma } from '@prisma/client'

import { DatabaseService } from 'src/database/database.service'
import { PrismaService } from 'src/prisma.service'
import { UserEntry } from 'src/user/models/user.model'

@Injectable()
export class UserAdapter extends DatabaseService<UserEntry> {
    constructor(protected readonly prisma: PrismaService) {
        super(prisma.user, prisma, (client) => client.user)
    }

    async findUser(where: Record<string, unknown>, transaction?: Prisma.TransactionClient): Promise<UserEntry> {
        try {
            return await this.findEntry(where, transaction)
        } catch (error: unknown) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException('UserAdapter:findUser: No user found')
            }

            throw error
        }
    }

    async ensureEmailNotTaken(email: string): Promise<void> {
        const existingUser: UserEntry | null = await this.findFirst({ email })

        if (existingUser) throw new ConflictException('UserAdapter:ensureEmailNotTaken: Email is already taken')
    }
}
