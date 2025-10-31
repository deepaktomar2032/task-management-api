import { Module } from '@nestjs/common'

import { DatabaseModule } from 'src/database/database.module'

import { UserAdapter } from './user.adapter'

@Module({
    imports: [DatabaseModule],
    providers: [UserAdapter],
    exports: [UserAdapter]
})
export class AdapterModule {}
