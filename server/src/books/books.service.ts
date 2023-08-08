import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';
import mongoose from 'mongoose';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: SoftDeleteModel<BookDocument>) { }

  async create(createBookDto: CreateBookDto) {
    const { ...rest } = createBookDto
    const createdBook = await this.bookModel.create(
      {
        ...rest,
      })
    return createdBook

  }

  async findAll(limit: number, currentPage: number, queryString: string) {
    const { filter, population } = aqp(queryString)
    let { sort }: { sort: any } = aqp(queryString)
    delete filter.current
    delete filter.pageSize
    // console.log('>>filter', filter)

    const offset = (currentPage - 1) * limit
    const defaultLimit = limit ? limit : 3

    const totalItems = (await this.bookModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.bookModel.find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort)
      .populate(population)
      .sort(sort)

    console.log(">> query", result)
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

  async findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Book not found'
    }
    const book = await this.bookModel.findOne({ _id: id })
    return book
  }

  async update(updateBookDto: UpdateBookDto) {
    if (!mongoose.Types.ObjectId.isValid(updateBookDto._id)) {
      return 'Book not found'
    }
    return this.bookModel.updateOne({ _id: updateBookDto._id }, { ...updateBookDto })
  }


  async remove(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'Book not found'
    }
    const foundBook = await this.bookModel.findById({ _id: id })
    const deleteBookById = await this.bookModel.softDelete({ _id: id })
    return deleteBookById
  }
}
