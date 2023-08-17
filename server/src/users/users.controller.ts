import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, CreateUserDtoArray } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public } from 'src/decorators/public.decorator';
import { ResponseMessage } from 'src/decorators/message.decorator';
import { PasswordChangeDto } from './dto/change-password-user.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from './roles/roles.enum';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Roles(Role.Admin)
  @ResponseMessage("Create a new user")
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('bulk-create')
  @Roles(Role.Admin)
  @ResponseMessage("Create list users")
  createBulk(@Body() createUserDtos: CreateUserDtoArray) {
    return this.usersService.createBulk(createUserDtos);
  }

  @Get()
  @Roles(Role.Admin)
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
  @Roles(Role.Admin)
  @ResponseMessage("Delete a user")
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('/password')
  @ResponseMessage("User change password")
  changePassword(@Body() passwordChangeDto: PasswordChangeDto) {
    return this.usersService.changePassword(passwordChangeDto);
  }

}
