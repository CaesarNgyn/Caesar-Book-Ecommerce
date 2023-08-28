import { Controller, Get, Param } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ResponseMessage } from 'src/decorators/message.decorator';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/users/roles/roles.enum';
import { ApiTags } from "@nestjs/swagger";

@ApiTags('database')
@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) { }

  @Public()
  @Get('category')
  @ResponseMessage("Fetch book categories")
  findCategories() {
    return this.databaseService.findCategories();
  }

  @Get('dashboard')
  @Roles(Role.Admin)
  @ResponseMessage("Fetch dashboard")
  getDashboard() {
    return this.databaseService.getDashboard();
  }
}
