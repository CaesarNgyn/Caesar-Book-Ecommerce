
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTimestampsConfig } from 'mongoose';

export type BookDocument = HydratedDocument<Book> & SchemaTimestampsConfig;


@Schema({ timestamps: true })
export class Book {
  @Prop()
  thumbnail: string;

  @Prop()
  slider: string[];

  @Prop()
  mainText: string;

  @Prop()
  author: string;

  @Prop()
  price: number;

  @Prop()
  sold: number;

  @Prop()
  quantity: number;

  @Prop()
  category: string;


}

export const BookSchema = SchemaFactory.createForClass(Book);