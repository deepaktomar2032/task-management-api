import { Test, TestingModule } from '@nestjs/testing'

import { TaskAdapter } from 'src/adapters/task.adapter'
import { UserAdapter } from 'src/adapters/user.adapter'
import { CreateTaskRequestDto, TaskResponseDto } from 'src/task/dto/task.dto'
import { TaskEntry } from 'src/task/models/task.model'

import { TaskService } from './task.service'

const mockTaskAdapter = {
    findEntries: jest.fn(),
    findUser: jest.fn(),
    insertEntry: jest.fn(),
    updateTaskById: jest.fn(),
    deleteTaskById: jest.fn()
}

const mockUserAdapter = {
    ensureEmailNotTaken: jest.fn(),
    insertEntry: jest.fn(),
    findUser: jest.fn()
}

describe('TaskService', () => {
    let taskService: TaskService

    beforeEach(async () => {
        jest.clearAllMocks()
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TaskService,
                { provide: TaskAdapter, useValue: mockTaskAdapter },
                { provide: UserAdapter, useValue: mockUserAdapter }
            ]
        }).compile()
        taskService = module.get<TaskService>(TaskService)
    })

    it('should be defined', () => {
        expect(taskService).toBeDefined()
    })

    describe('getAllTasks', () => {
        it('should fetch all tasks', async () => {
            const storedTasks: TaskEntry[] = [
                {
                    id: 1,
                    title: 'Task 1',
                    description: 'Description 1',
                    status: 'in_progress',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    userId: 1
                },
                {
                    id: 2,
                    title: 'Task 2',
                    description: 'Description 2',
                    status: 'completed',
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    userId: 1
                }
            ]

            const findEntriesSpy = jest.spyOn(mockTaskAdapter, 'findEntries').mockResolvedValue(storedTasks)

            const fetchedTasks: TaskResponseDto[] = await taskService.getAllTasks()
            const mappedTasks: TaskResponseDto[] = storedTasks.map((task) => ({
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                created_at: task.createdAt,
                updated_at: task.updatedAt,
                user_id: task.userId
            }))

            expect(fetchedTasks).toEqual(mappedTasks)

            expect(findEntriesSpy).toHaveBeenCalled()
        })
    })

    describe('createTask', () => {
        it('should create a new task', async () => {
            const createTaskDto: CreateTaskRequestDto = {
                title: 'New Task',
                description: 'New Task Description',
                userId: 1
            }

            const insertedTask: TaskEntry = {
                id: 1,
                title: createTaskDto.title,
                description: createTaskDto.description,
                status: 'todo',
                createdAt: new Date(),
                updatedAt: new Date(),
                userId: createTaskDto.userId
            }

            const findUserSpy = jest.spyOn(mockUserAdapter, 'findUser').mockResolvedValueOnce({
                id: 1,
                name: 'John Doe',
                email: 'john.doe@example.com'
            })

            const insertEntrySpy = jest.spyOn(mockTaskAdapter, 'insertEntry').mockResolvedValueOnce(insertedTask)

            const newTask: TaskResponseDto = await taskService.createTask(createTaskDto)

            const mappedNewTask: TaskResponseDto = {
                id: insertedTask.id,
                title: insertedTask.title,
                description: insertedTask.description,
                status: insertedTask.status,
                created_at: insertedTask.createdAt,
                updated_at: insertedTask.updatedAt,
                user_id: insertedTask.userId
            }

            expect(newTask).toEqual(mappedNewTask)
            expect(findUserSpy).toHaveBeenCalledWith({ id: createTaskDto.userId })
            expect(insertEntrySpy).toHaveBeenCalledWith({
                title: createTaskDto.title,
                description: createTaskDto.description,
                userId: createTaskDto.userId
            })
        })
    })
})
