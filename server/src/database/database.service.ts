import { Injectable } from '@nestjs/common';
import { CATEGORY } from './database.category';
import { OrdersService } from 'src/orders/orders.service';
import { BooksService } from 'src/books/books.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DatabaseService {
  constructor(
    private orderService: OrdersService,
    private readonly booksService: BooksService,
    private readonly usersService: UsersService
  ) { }

  async findCategories() {
    const categories = CATEGORY
    return categories
  }

  async getDashboard() {
    const allUsers = await this.usersService.countTotal();
    const allOrders = await this.orderService.countTotal();
    const allBooks = await this.booksService.countTotal();
    const revenue = await this.orderService.countRevenue()

    return {
      users: allUsers,
      orders: allOrders,
      books: allBooks,
      revenue: revenue
    }
  }
}
