import { Module } from '@nestjs/common'

import { TaskModule } from 'src/task/task.module'
import { UserModule } from 'src/user/user.module'

@Module({
    imports: [TaskModule, UserModule],
    controllers: [],
    providers: []
})
export class AppModule {}
