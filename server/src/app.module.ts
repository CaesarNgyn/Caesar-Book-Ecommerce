import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { FileModule } from './file/file.module';
import { BooksModule } from './books/books.module';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),
  MongooseModule.forRootAsync({
    imports: [ConfigModule],
    useFactory: async (configService: ConfigService) => ({
      uri: configService.get<string>('MONGODB_URI'),
      dbName: configService.get<string>('DB_NAME'),
      connectionFactory: (connection) => {
        connection.plugin(softDeletePlugin);
        return connection;
      }
    }),
    inject: [ConfigService],
  }),
    UsersModule,
    AuthModule,
    FileModule,
    BooksModule,
    DatabaseModule],
  controllers: [AppController],
  providers: [AppService, ConfigService]

})
export class AppModule { }
