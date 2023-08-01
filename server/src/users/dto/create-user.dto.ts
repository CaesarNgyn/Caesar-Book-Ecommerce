import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
  @IsEmail({}, { message: 'Email không hợp lệ!' })
  @IsNotEmpty({ message: 'Email không được để trống!' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống!' })
  password: string;

  @IsNotEmpty({ message: 'Full Name không được để trống!' })
  fullName: string;

  @IsNotEmpty({ message: 'Phone không được để trống!' })
  phone: string

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

}