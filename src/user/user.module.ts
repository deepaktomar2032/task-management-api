import { Module } from '@nestjs/common'

import { AdapterModule } from 'src/adapters/adapter.module'

import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'

@Module({
    imports: [AdapterModule],
    providers: [UserService],
    controllers: [UserController]
})
export class UserModule {}
