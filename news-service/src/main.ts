import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { AppModule } from './app.module'

async function bootstrap() {
  const configService = new ConfigService()
  const app = await NestFactory.create(AppModule)

  app.setGlobalPrefix('api/news')

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  await app.listen(configService.get('PORT'))
}

bootstrap()
