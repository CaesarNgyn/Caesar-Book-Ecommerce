import { Type } from "class-transformer"
import { IsArray, IsMongoId, IsNotEmpty, IsNumber, IsString, Length, ValidateNested } from "class-validator"
import mongoose from "mongoose"


class OrderDetailDto {
  @IsNotEmpty({ message: 'Book Name không được để trống!' })
  bookName: mongoose.Schema.Types.ObjectId

  @IsNotEmpty({ message: 'Quantity không được để trống!' })
  @IsNumber({}, { message: 'Quantity phải có dạng số' })
  quantity: number

  @IsNotEmpty({ message: 'ID Book không được để trống!' })
  @IsMongoId({ message: "_id phải có dạng id" })
  _id: mongoose.Schema.Types.ObjectId

}

export class CreateOrderDto {
  @IsNotEmpty({ message: 'Name không được để trống!' })
  name: string;

  @IsNotEmpty({ message: 'Address không được để trống!' })
  address: string;

  @IsNotEmpty({ message: 'Phone không được để trống!' })
  @IsString({ message: 'Phone phải có định dạng là chuỗi!' })
  @Length(10, 20, { message: 'Phone phải có ít nhất 10 chữ số!' })
  phone: string;

  @IsNotEmpty({ message: 'Total Price không được để trống!' })
  @IsNumber({}, { message: 'Total Price phải có định dạng number!' })
  totalPrice: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderDetailDto)
  detail: OrderDetailDto[];
}
