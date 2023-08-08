import { IsArray, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateBookDto {
  @IsNotEmpty({ message: 'Thumbnail không được để trống!' })
  thumbnail: string;

  @IsArray({ message: 'Slider phải có định dạng array' })
  @IsString({ each: true, message: 'Slider phải chứa các phần tử là string' }) // Validate each element of the array as a string
  slider: string[];

  @IsNotEmpty({ message: 'Main Text không được để trống!' })
  mainText: string;

  @IsNotEmpty({ message: 'Author không được để trống!' })
  author: string;

  @IsNotEmpty({ message: 'Price không được để trống!' })
  @IsNumber({}, { message: 'Price phải có định dạng number!' })
  price: number;

  @IsNotEmpty({ message: 'Full Name không được để trống!' })
  @IsNumber({}, { message: 'Sold phải có định dạng number!' })
  sold: number;

  @IsNotEmpty({ message: 'Quantity không được để trống!' })
  @IsNumber({}, { message: 'Quantity phải có định dạng number!' })
  quantity: number;

  @IsNotEmpty({ message: 'Category không được để trống!' })
  category: string;
}
