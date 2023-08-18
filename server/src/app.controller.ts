import { Controller, Get, Post, Request, UseGuards, VERSION_NEUTRAL } from '@nestjs/common';
import { AppService } from './app.service';
import { LocalAuthGuard } from './auth/guard/local-auth.guard';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guard/jwt-auth.guard';
import { Public } from './decorators/public.decorator';

@Controller({ version: VERSION_NEUTRAL })
export class AppController {
  constructor(
    private readonly appService: AppService,

  ) { }


  // @Get()
  // @Public()
  // root() {
  //   return "Hello World"
  // }
}
