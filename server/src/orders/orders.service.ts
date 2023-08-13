import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Book, BookDocument } from 'src/books/schemas/book.schema';
import { BooksService } from 'src/books/books.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: SoftDeleteModel<OrderDocument>,
    private readonly booksService: BooksService
  ) { }

  async create(createOrderDto: CreateOrderDto) {
    const { name, address, phone, totalPrice, detail } = createOrderDto
    const booksId = detail.map((item, index) =>
      item._id.toString()
    )
    const allBooks = await this.booksService.fetchIdOfAllBooks()

    const allBooksAvailable = booksId.every((bookId) =>
      allBooks.includes(bookId)
    );
    if (allBooksAvailable === false) {
      throw new BadRequestException('Books trong order không tồn tại')
    }
    const createdOrder = await this.orderModel.create(
      {
        name,
        address,
        phone,
        totalPrice,
        detail
      })
    return `Transaction has been successfully created`
  }

  findAll() {
    return `This action returns all orders`;
  }


}
