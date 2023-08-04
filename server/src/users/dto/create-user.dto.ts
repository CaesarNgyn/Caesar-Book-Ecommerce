import { Transform } from "class-transformer";
import { IsEmail, IsInt, IsNotEmpty, IsNumber, IsNumberString, IsPhoneNumber, IsString, Length, Min } from "class-validator";

export class CreateUserDto {
  @IsEmail({}, { message: 'Email không hợp lệ!' })
  @IsNotEmpty({ message: 'Email không được để trống!' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống!' })
  password: string;

  @IsNotEmpty({ message: 'Full Name không được để trống!' })
  fullName: string;

  @IsNotEmpty({ message: 'Phone không được để trống!' })
  @Min(1000000000, { message: 'Phone phải có tối thiểu 10 chữ số' })
  @IsNumber({}, { message: 'Phone phải có định dạng số!' })
  phone: number;

  avatar: string;

  role: string;
}

export class RegisterUserDto {
  @IsNotEmpty({ message: 'Full Name không được để trống!' })
  fullName: string;

  @IsEmail({}, { message: 'Email không hợp lệ!' })
  @IsNotEmpty({ message: 'Email không được để trống!' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống!' })
  password: string;

  @IsNotEmpty({ message: 'Phone không được để trống!' })
  @IsString({ message: 'Phone phải có định dạng là chuỗi!' })
  @Length(10, 20, { message: 'Phone phải có ít nhất 10 chữ số!' })
  phone: string;

}