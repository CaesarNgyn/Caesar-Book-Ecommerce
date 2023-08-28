import { Transform, Type } from "class-transformer";
import { IsArray, IsEmail, IsInt, IsNotEmpty, IsNumber, IsNumberString, IsPhoneNumber, IsString, Length, Min, ValidateNested } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsEmail({}, { message: 'Email không hợp lệ!' })
  @IsNotEmpty({ message: 'Email không được để trống!' })
  email: string;

  @IsNotEmpty({ message: 'Password không được để trống!' })
  password: string;

  @IsNotEmpty({ message: 'Full Name không được để trống!' })
  fullName: string;

  @IsNotEmpty({ message: 'Phone không được để trống!' })
  @IsString({ message: 'Phone phải có định dạng là chuỗi!' })
  @Length(10, 20, { message: 'Phone phải có ít nhất 10 chữ số!' })
  phone: string;

  avatar: string;

  role: string;
}

export class CreateUserDtoArray {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUserDto)
  users: CreateUserDto[];
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

export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@gmail.com', description: 'username' })
  readonly username: string;
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: 'password',
  })
  readonly password: string;
}
