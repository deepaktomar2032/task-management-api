import { Module } from '@nestjs/common'

import { DatabaseModule } from 'src/database/database.module'

import { TaskAdapter } from './task.adapter'
import { UserAdapter } from './user.adapter'

@Module({
    imports: [DatabaseModule],
    providers: [TaskAdapter, UserAdapter],
    exports: [TaskAdapter, UserAdapter]
})
export class AdapterModule {}
