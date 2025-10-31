import { Body, Controller, Inject, Post } from '@nestjs/common'

import { type CreateUserRequestDto, CreateUserSchema, type UserResponseDto } from 'src/user/dto/user.dto'
import { UserService } from 'src/user/services/user.service'
import { ZodValidationPipe } from 'src/utils/validation.pipe'

@Controller('user')
export class UserController {
    @Inject() private readonly userService: UserService

    @Post()
    async createUser(
        @Body(new ZodValidationPipe(CreateUserSchema)) body: CreateUserRequestDto
    ): Promise<UserResponseDto> {
        return this.userService.createUser(body)
    }
}
