import { INestApplication, Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

const logger: Logger = new Logger('Bootstrap Module')

async function bootstrap() {
    try {
        const app: INestApplication = await NestFactory.create(AppModule)

        app.enableCors({
            origin: true,
            methods: ['GET', 'POST', 'PATCH', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Accept', 'Origin'],
            credentials: false
        })

        const PORT: number = 3000

        logger.log(`Server is up & running on Port: ${PORT}`)
        logger.log(`API is ready to use: http://localhost:${PORT}`)

        await app.listen(PORT)
    } catch (error: unknown) {
        logger.error('bootstrap: ', error)
        process.exit(1)
    }
}

bootstrap()
