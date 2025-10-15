import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';

import { configProvider } from './app.config.provider';
import { FilmsController } from './films/films.controller';
import { OrderController } from './order/order.controller';
import { FilmsService } from './films/films.service';
import { OrderService } from './order/order.service';
import { MongoFilmsRepository } from './repository/mongo-films/mongo-films.repository';
import { PostgresFilmsRepository } from './repository/postgres-films/postgres-films.repository';
import { FilmSchema } from './repository/mongo-films/schema/films.schema';
import { FilmEntity } from './repository/postgres-films/entities/film.entity';
import { ScheduleEntity } from './repository/postgres-films/entities/schedule.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    // подключение к БД
    ...(configProvider.useValue.database.driver === 'mongodb'
      ? [
          MongooseModule.forRoot(configProvider.useValue.database.url),
          // регистрация модели в приложении
          MongooseModule.forFeature([{ name: 'Film', schema: FilmSchema }]),
        ]
      : [
          TypeOrmModule.forRoot({
            type: configProvider.useValue.database.driver as any,
            url: configProvider.useValue.database.url,
            schema: configProvider.useValue.database.schema,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
          }),
          TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
        ]),
    // раздача статических файлов из public
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public', 'content', 'afisha'),
      serveRoot: '/content/afisha',
    }),
  ],
  controllers: [FilmsController, OrderController],
  providers: [
    configProvider,
    FilmsService,
    OrderService,
    {
      provide: 'IFilmsRepository',
      useClass:
        configProvider.useValue.database.driver === 'mongodb'
          ? MongoFilmsRepository
          : PostgresFilmsRepository,
    },
  ],
})
export class AppModule {}
