import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { DatabaseController } from './database.controller';
import { OrdersModule } from 'src/orders/orders.module';
import { BooksModule } from 'src/books/books.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [OrdersModule, BooksModule, UsersModule],
  controllers: [DatabaseController],
  providers: [DatabaseService]
})
export class DatabaseModule { }
