import { ConfigService, ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('PG_CONNECTION'),
        autoLoadEntities: true,
        synchronize: true,
        logging: false,
        bigNumberStrings: false,
      }),
      imports: [ConfigModule.forRoot()],
      inject: [ConfigService],
    }),
    AuthModule,
  ],
})
export class AppModule {}
