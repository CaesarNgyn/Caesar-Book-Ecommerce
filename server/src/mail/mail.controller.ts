import { Controller, Get } from '@nestjs/common';
import { MailService } from './mail.service';
import { Public } from 'src/decorators/public.decorator';
import { ResponseMessage } from 'src/decorators/message.decorator';
import { MailerService } from '@nestjs-modules/mailer';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
  ) { }

  @Get()
  @Public()
  @ResponseMessage("Send thanking mail")
  handleSendEmail(email: string) {
    return this.mailService.handleSendEmail(email)
  }

}