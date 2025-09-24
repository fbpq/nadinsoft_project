import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TasksModule } from './tasks/tasks.module';
import { FilesModule } from './files/files.module';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: +(process.env.DB_PORT || 3306),
        username: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'farhadsaeidi81',
        database: process.env.DB_NAME || 'nadinsoft',
        entities: [__dirname + '/**/*.entity{.ts,.js}'], 
        synchronize: true,
      }),
    }),
    AuthModule,
    UsersModule,
    TasksModule,
    FilesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}