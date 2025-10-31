import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'

import { TaskModule } from 'src/task/task.module'
import { UserModule } from 'src/user/user.module'

import { LoggerMiddleware } from './middlewares/logger.middleware'

@Module({
    imports: [TaskModule, UserModule],
    controllers: [],
    providers: []
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*')
    }
}
