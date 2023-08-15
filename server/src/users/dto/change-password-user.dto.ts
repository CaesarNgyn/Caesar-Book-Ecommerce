// password-change.dto.ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class PasswordChangeDto {
  @IsNotEmpty()
  email: string;

  @IsNotEmpty({ message: 'Old Password không được để trống!' })
  oldpassword: string;

  @IsNotEmpty({ message: 'New Password không được để trống!' })
  @MinLength(6, { message: 'Mật khẩu phải dài ít nhất 6 kí tự' }) // Assuming you have a minimum password length requirement
  newpassword: string;
}