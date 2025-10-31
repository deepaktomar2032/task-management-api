import { Prisma } from '@prisma/client'

import { PrismaService } from 'src/prisma.service'

export type Delegate<T> = {
    findMany(args?: unknown): Promise<T[]>
    findFirst(args?: unknown): Promise<T | null>
    findUniqueOrThrow(args?: unknown): Promise<T>
    create(args: unknown): Promise<T>
    update(args: unknown): Promise<T>
    delete(args: unknown): Promise<T>
}

type DelegateResolver<T> = (client: Prisma.TransactionClient | PrismaService) => Delegate<T>

export class DatabaseService<T> {
    constructor(
        protected readonly delegate: Delegate<T>,
        protected readonly prisma?: PrismaService,
        private readonly resolve?: DelegateResolver<T>
    ) {}

    async findEntries(args?: unknown, transaction?: Prisma.TransactionClient): Promise<T[]> {
        return this.getDelegate(transaction).findMany(args)
    }

    async findFirst(where: Record<string, unknown>): Promise<T | null> {
        return this.delegate.findFirst({ where })
    }

    async findEntry(where: Record<string, unknown>, transaction?: Prisma.TransactionClient): Promise<T> {
        return this.getDelegate(transaction).findUniqueOrThrow({ where })
    }

    async insertEntry(data: Partial<T>, transaction?: Prisma.TransactionClient): Promise<T> {
        return this.getDelegate(transaction).create({ data })
    }

    async updateEntry(
        where: Record<string, unknown>,
        data: Partial<T>,
        transaction?: Prisma.TransactionClient
    ): Promise<T> {
        const delegate = this.getDelegate(transaction)
        if (!delegate.update) throw new Error('Update is not supported for this delegate')
        return delegate.update({ where, data })
    }

    async deleteEntry(where: Record<string, unknown>, transaction?: Prisma.TransactionClient): Promise<T> {
        return this.getDelegate(transaction).delete({ where })
    }

    async transaction<R>(callback: (transaction: Prisma.TransactionClient) => Promise<R>): Promise<R> {
        if (!this.prisma) throw new Error('PrismaService is not available')

        return this.prisma.$transaction((transaction) => callback(transaction))
    }

    private getDelegate(transaction?: Prisma.TransactionClient): Delegate<T> {
        if (transaction && this.resolve) return this.resolve(transaction)
        return this.delegate
    }
}
