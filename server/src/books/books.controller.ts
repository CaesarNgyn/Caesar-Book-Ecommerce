import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ResponseMessage } from 'src/decorators/message.decorator';
import { Public } from 'src/decorators/public.decorator';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) { }

  @Post()
  @ResponseMessage("Create a new book")
  create(@Body() createBookDto: CreateBookDto) {
    return this.booksService.create(createBookDto);
  }


  @Public()
  @Get()
  @ResponseMessage("Fetch list books with pagination")
  findAll(
    @Query() queryString: string,
    @Query("pageSize") limit: string,
    @Query("current") page: string
  ) {
    return this.booksService.findAll(+limit, +page, queryString);
  }


  @Public()
  @Get(':id')
  @ResponseMessage("Fetch book by ID")
  findOne(@Param('id') id: string) {
    return this.booksService.findOne(id);
  }

  @Patch()
  @ResponseMessage("Update a book")
  update(@Body() updateBookDto: UpdateBookDto) {
    return this.booksService.update(updateBookDto);
  }


  @Delete(':id')
  @ResponseMessage("Delete a book")
  remove(@Param('id') id: string) {
    return this.booksService.remove(id);
  }
}
