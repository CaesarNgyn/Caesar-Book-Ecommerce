import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateBookDto } from './create-book.dto';

export class UpdateBookDto extends OmitType(CreateBookDto, ['thumbnail', 'slider', 'mainText', 'author', "price", "sold", "quantity", "category"] as const) {
  _id: string
}
