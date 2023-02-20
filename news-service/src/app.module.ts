import { NewsModule } from './news/news.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

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
    NewsModule,
  ],
})
export class AppModule {}
