import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Book, BookDocument } from 'src/books/schemas/book.schema';
import { BooksService } from 'src/books/books.service';
import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/users/users.interface';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: SoftDeleteModel<OrderDocument>,
    private readonly booksService: BooksService,
    private readonly usersService: UsersService
  ) { }

  async create(createOrderDto: CreateOrderDto, user: IUser) {
    const { name, address, phone, totalPrice, detail } = createOrderDto
    const userEmail = await this.usersService.findOneByUsername(user.email)
    const { email } = userEmail
    console.log("email>>", email)

    if (!userEmail) {
      throw new BadRequestException('User not found')
    }

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
        email,
        name,
        address,
        phone,
        totalPrice,
        detail
      })
    // return createdOrder
    return `Transaction has been successfully created`
  }

  findAll() {
    return `This action returns all orders`;
  }

  async findHistoryOrders(user: IUser) {
    const userEmail = await this.usersService.findOneByUsername(user.email)
    const { email } = userEmail
    // console.log("email>>", email)
    if (!userEmail) {
      throw new BadRequestException('User not found')
    }
    const ordersByEmail = await this.orderModel.find({ email: email }).lean().exec()
    // console.log("ordersByEmail", ordersByEmail)
    const orderHistory = ordersByEmail.map(order => {
      return {
        totalPrice: order.totalPrice,
        updatedAt: order.updatedAt,
        detail: order.detail,
      };
    });

    return orderHistory;

  }
}
