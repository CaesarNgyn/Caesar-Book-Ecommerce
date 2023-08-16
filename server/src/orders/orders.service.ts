import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Book, BookDocument } from 'src/books/schemas/book.schema';
import { BooksService } from 'src/books/books.service';
import { UsersService } from 'src/users/users.service';
import { IUser } from 'src/users/users.interface';
import aqp from 'api-query-params';
import mongoose, { ObjectId } from 'mongoose';

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
    for (const item of detail) {
      await this.booksService.updateAfterSold(item._id.toString(), item.quantity);
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

  async findAll(limit: number, currentPage: number, queryString: string) {
    const { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    // console.log('>>filter', filter)

    const offset = (currentPage - 1) * limit
    const defaultLimit = limit ? limit : 3

    const totalItems = (await this.orderModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);


    const result = await this.orderModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .sort(sort)


    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems // tổng số phần tử (số bản ghi)
      },
      result //kết quả query
    };
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


  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Order not found'
    }
    const order = await this.orderModel.findOne({ _id: id })
    if (!order) {
      throw new NotFoundException('Cannot find the order with the relevant ID')
    }
    return order
  }

  async countTotal() {
    const total = await this.orderModel.countDocuments()
    return total
  }

  async countRevenue() {
    const ordersWithTotalPrice = await this.orderModel.find({})
    const results = ordersWithTotalPrice.map(item => {
      return {
        money: item.totalPrice,
        when: item.createdAt
      }
    })
    return results
  }

}
