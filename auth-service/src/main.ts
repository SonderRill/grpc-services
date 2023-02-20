import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { AUTH_PACKAGE_NAME } from './auth/constants'

async function bootstrap() {
  const configService = new ConfigService()

  const app = await NestFactory.create(AppModule)
  app.setGlobalPrefix('api/auth')

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      url: `${configService.get('GRPC_HOST')}:${configService.get('GRPC_PORT')}`,
      package: AUTH_PACKAGE_NAME,
      protoPath: 'auth.proto',
    },
  })

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }))

  await app.startAllMicroservices()
  await app.listen(configService.get('PORT'))
}

bootstrap()
