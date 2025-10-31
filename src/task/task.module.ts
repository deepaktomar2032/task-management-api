import { Module } from '@nestjs/common'

import { AdapterModule } from 'src/adapters/adapter.module'
import { TaskController } from 'src/task/controllers/task.controller'
import { TaskService } from 'src/task/services/task.service'

@Module({
    imports: [AdapterModule],
    providers: [TaskService],
    controllers: [TaskController]
})
export class TaskModule {}
