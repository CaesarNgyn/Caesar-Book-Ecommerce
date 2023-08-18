import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { OrdersModule } from './orders/orders.module';
import { MailModule } from './mail/mail.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerGuard } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { UsersController } from './users/users.controller';
import { HealthController } from './health/health.controller';
import { TerminusModule } from '@nestjs/terminus';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { CloudinaryService } from './cloudinary/cloudinary.service';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }),
  ThrottlerModule.forRoot({
    ttl: 60,
    limit: 20,
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
    DatabaseModule,
    OrdersModule,
    MailModule,
    TerminusModule,
    HealthModule,
    CloudinaryModule],
  controllers: [AppController],
  providers: [AppService,
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    CloudinaryService,
  ]

})

export class AppModule { }

