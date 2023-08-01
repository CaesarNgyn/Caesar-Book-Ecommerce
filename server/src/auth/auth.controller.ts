import { Controller, Get, Post, UseGuards, Request, Body, Res, Req } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { Response } from "express";
import { LocalAuthGuard } from "./guard/local-auth.guard";
import { Public } from "src/decorators/public.decorator";
import { ResponseMessage } from "src/decorators/message.decorator";
import { RegisterUserDto } from "src/users/dto/create-user.dto";
import { User } from "src/decorators/user.decorator";
import { IUser } from "src/users/users.interface";


@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage("User login")
  @Post('login')
  async login(@Request() req,
    //set passthrough to true so that The modified response will be passed through to the next handler/middleware
    @Res({ passthrough: true }) response: Response) {
    return this.authService.login(req.user, response)
  }

  @Public()
  @Post('/register')
  @ResponseMessage("Register a new user")
  async register(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.register(registerUserDto)
  }

  @Get('/account')
  @ResponseMessage("Get user information")
  async getInfo(@User() user: IUser) {
    return {
      user
    }
  }

  @Public()
  @Get('/refresh')
  @ResponseMessage("Refresh token")
  async refresh(@Request() req,
    @Res({ passthrough: true }) response: Response
  ) {
    console.log("refresh>>", req.cookies)
    return this.authService.refresh(req.cookies['refresh_token'], response)
  }

  @Post('/logout')
  @ResponseMessage("Logout user")
  async logout(@Request() req,
    @Res({ passthrough: true }) response: Response
  ) {
    return this.authService.logout(req.cookies['refresh_token'], response)
  }

}