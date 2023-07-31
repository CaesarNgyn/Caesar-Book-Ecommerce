import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/decorators/public.decorator';
import { ResponseMessage } from 'src/decorators/message.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Public()
  @Post()
  @ResponseMessage("Create a new user")
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ResponseMessage("Fetch list users with pagination")
  findAll(
    @Query() queryString: string,
    @Query("pageSize") limit: string,
    @Query("current") page: string
  ) {
    return this.usersService.findAll(+limit, +page, queryString);
  }

  @Get(':id')
  @ResponseMessage("Fetch user by ID")
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch()
  @ResponseMessage("Update a user")

  update(@Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto);
  }

  @Delete(':id')
  @ResponseMessage("Delete a user")
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
