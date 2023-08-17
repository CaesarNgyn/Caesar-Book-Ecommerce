import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService
  ) { }
  async handleSendEmail(email: string) {
    await this.mailerService.sendMail({
      to: `${email}`,
      from: `" Caesar Martin's Book Store" <support@example.com>`, // override default from
      subject: 'Thư cảm ơn',
      html: `<br>Cảm ơn quý khách hàng đã tin tưởng Caesar Martin's Book. Cửa hàng mong luôn được đồng hành trên con đường tri thức cùng quý khách
          <br></br>
          <br></br>
          Sincerely,
          <br></br>
          Quản lý chuỗi - Caesar Martin
          <br></br>
          <br></br>
         </b>`, // HTML body content
    });
    return "Mail sent successfully"
  }
}

