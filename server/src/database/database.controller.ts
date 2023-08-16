import { Controller, Get, Param } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ResponseMessage } from 'src/decorators/message.decorator';
import { Public } from 'src/decorators/public.decorator';

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
  @ResponseMessage("Fetch dashboard")
  getDashboard() {
    return this.databaseService.getDashboard();
  }
}
