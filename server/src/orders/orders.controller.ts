import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ResponseMessage } from 'src/decorators/message.decorator';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/users/users.interface';


@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @ResponseMessage("Create a new order")
  create(@Body() createOrderDto: CreateOrderDto, @User() user: IUser) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('/history')
  findHistoryOrders(@User() user: IUser) {
    return this.ordersService.findHistoryOrders(user)
  }

}
