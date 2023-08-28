import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ResponseMessage } from 'src/decorators/message.decorator';
import { User } from 'src/decorators/user.decorator';
import { IUser } from 'src/users/users.interface';

import { ApiTags } from "@nestjs/swagger";

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @ResponseMessage("Create a new order")
  create(@Body() createOrderDto: CreateOrderDto, @User() user: IUser) {
    return this.ordersService.create(createOrderDto, user);
  }

  @Get()
  @ResponseMessage("Fetch list orders with pagination")
  findAll(
    @Query() queryString: string,
    @Query("pageSize") limit: string,
    @Query("current") page: string
  ) {
    return this.ordersService.findAll(+limit, +page, queryString);
  }

  @Get('/history')
  findHistoryOrders(@User() user: IUser) {
    return this.ordersService.findHistoryOrders(user)
  }

  @Get(':id')
  @ResponseMessage("Fetch order by ID")
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }
}
