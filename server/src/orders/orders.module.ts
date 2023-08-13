import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { Book, BookSchema } from 'src/books/schemas/book.schema';
import { BooksService } from 'src/books/books.service';
import { BooksModule } from 'src/books/books.module';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Order.name, schema: OrderSchema },
  ]), BooksModule],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule { }
