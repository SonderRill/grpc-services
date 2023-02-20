import { ConfigModule, ConfigService } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ProductController } from './news.controller'
import { NewsService } from './news.service'
import { NewsEntity } from './entity/news.entity'
import { UserEntity } from './entity/user.entity'
import { RemoteAuthService } from './remote-auth.service'
import { ClientsModule, Transport } from '@nestjs/microservices'

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        inject:[ConfigService],
        imports:[ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            package: 'auth',
            protoPath: 'auth.proto',
            url: `${configService.get('AUTH_GRPC_HOST')}:${configService.get('AUTH_GRPC_PORT')}`,
          },
        }),
      },
    ]),
    TypeOrmModule.forFeature([NewsEntity, UserEntity]),
  ],
  controllers: [ProductController],
  providers: [NewsService, RemoteAuthService],
})
export class NewsModule {}
