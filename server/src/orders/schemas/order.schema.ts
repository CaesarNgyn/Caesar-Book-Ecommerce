
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, SchemaTimestampsConfig } from 'mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type OrderDocument = HydratedDocument<Order> & SchemaTimestampsConfig;

@Schema()
export class OrderDetail {
  @Prop()
  bookName: string;

  @Prop()
  quantity: number;

  @Prop()
  _id: string;
}

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop()
  email: string

  @Prop()
  name: string

  @Prop()
  address: string

  @Prop()
  phone: string

  @Prop()
  totalPrice: number

  @Prop({ type: Object })
  detail: OrderDetail[]


}

export const OrderSchema = SchemaFactory.createForClass(Order);