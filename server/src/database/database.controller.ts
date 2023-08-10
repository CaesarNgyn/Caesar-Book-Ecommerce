import { Controller, Get, Param } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { ResponseMessage } from 'src/decorators/message.decorator';

@Controller('database')
export class DatabaseController {
  constructor(private readonly databaseService: DatabaseService) { }

  @Get('category')
  @ResponseMessage("Fetch book categories")
  findCategories() {
    return this.databaseService.findCategories();
  }
}
