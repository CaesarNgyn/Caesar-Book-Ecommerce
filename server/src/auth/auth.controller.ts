import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";

import { LocalAuthGuard } from "./guard/local-auth.guard";
import { Public } from "src/decorators/public.decorator";
import { ResponseMessage } from "src/decorators/message.decorator";

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage("User login")
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  //Test JWT
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}