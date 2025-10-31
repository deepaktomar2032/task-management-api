import { ConflictException, Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'

import { UserAdapter } from 'src/adapters/user.adapter'
import { type CreateUserRequestDto, type UserResponseDto } from 'src/user/dto/user.dto'
import { UserEntry } from 'src/user/models/user.model'

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name)

    @Inject() private readonly userAdapter: UserAdapter

    async createUser(body: CreateUserRequestDto): Promise<UserResponseDto> {
        try {
            // Ensure email is not already taken
            await this.userAdapter.ensureEmailNotTaken(body.email)

            const newUser: UserEntry = await this.userAdapter.insertEntry(body)

            this.logger.log(`User created with ID: ${newUser.id}, Name: ${newUser.name}, Email: ${newUser.email}`)

            return newUser
        } catch (error: unknown) {
            if (error instanceof ConflictException) {
                this.logger.warn(`User with email ${body.email} already exists`)
                throw new ConflictException(`User with email ${body.email} already exists`)
            }

            this.logger.error(error)
            throw new InternalServerErrorException(`Internal server error. Please try again.`)
        }
    }
}
