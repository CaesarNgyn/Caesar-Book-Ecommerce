import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/users.interface';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async validateUser(username: string, pass: string) {
    const user = await this.usersService.findOneByUsername(username);
    if (!user) {
      throw new BadRequestException('User not found!')
    }

    if (user) {
      const isValid = await bcrypt.compare(pass, user.password)
      if (isValid) {
        return user
      }
    }
    return null;
  }

  async login(user: IUser) {
    const { _id, name, email, role } = user
    const payload = {
      sub: "token login",
      iss: "from server",
      _id,
      name,
      email,
      role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      _id,
      name,
      email,
      role
    }
  }
}