import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Logger,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    UnprocessableEntityException
} from '@nestjs/common'

import {
    type AssignUserRequestDto,
    AssignUserSchema,
    type CreateTaskRequestDto,
    CreateTaskSchema,
    type TaskResponseDto,
    type UpdateTaskRequestDto,
    UpdateTaskSchema
} from 'src/task/dto/task.dto'
import { TaskService } from 'src/task/services/task.service'
import { ZodValidationPipe } from 'src/utils/validation.pipe'

@Controller('task')
export class TaskController {
    private readonly logger: Logger = new Logger(TaskController.name)

    @Inject() private readonly taskService: TaskService

    @Get()
    async listAllTasks(): Promise<TaskResponseDto[]> {
        return this.taskService.getAllTasks()
    }

    @Post()
    async createTask(
        @Body(new ZodValidationPipe(CreateTaskSchema)) body: CreateTaskRequestDto
    ): Promise<TaskResponseDto> {
        return this.taskService.createTask(body)
    }

    @Patch(':id')
    async updateTask(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ZodValidationPipe(UpdateTaskSchema)) body: UpdateTaskRequestDto
    ): Promise<TaskResponseDto> {
        // check for empty object
        if (Object.keys(body).length === 0) {
            this.logger.warn('No data provided for update')
            throw new UnprocessableEntityException('No data provided for update')
        }

        return this.taskService.updateTask(id, body)
    }

    @Delete(':id')
    async deleteTask(@Param('id', ParseIntPipe) id: number): Promise<Record<string, string>> {
        return this.taskService.deleteTask(id)
    }

    @Patch(':id/assign')
    async assignUserToTask(
        @Param('id', ParseIntPipe) id: number,
        @Body(new ZodValidationPipe(AssignUserSchema)) body: AssignUserRequestDto
    ): Promise<TaskResponseDto> {
        return this.taskService.assignUserToTask(id, body.userId)
    }
}
