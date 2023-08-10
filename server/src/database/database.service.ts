import { Injectable } from '@nestjs/common';
import { CATEGORY } from './database.category';

@Injectable()
export class DatabaseService {
  async findCategories() {
    const categories = CATEGORY
    return categories
  }
}
