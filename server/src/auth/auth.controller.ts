import { AuthService } from "./auth.service";
import { Controller, Post, Request, UseGuards } from "@nestjs/common";
import { LocalAuthGuard } from "./guard/local-auth.guard";


@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) { }

}