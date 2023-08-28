import { Controller, Post, Body, Param, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import PayPalAPI from './paypal.api';
import { Public } from 'src/decorators/public.decorator';
import { ApiTags } from "@nestjs/swagger";

@ApiTags('paypal')
@Controller('paypal')
export class PaypalController {
  private paypalAPI: PayPalAPI;

  constructor(private readonly configService: ConfigService) {
    this.paypalAPI = new PayPalAPI(configService); // Initialize the PayPalAPI with the ConfigService
  }

  @Post('/create-order')
  async createPaypalOrder(@Body() cart: any, @Res() res: Response) {
    try {
      const { jsonResponse, httpStatusCode } = await this.paypalAPI.createOrder(cart);
      res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
      console.error("Failed to create order:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to create order." });
    }
  }

  @Post('/capture-order')
  async capturePaypalOrder(@Body('orderID') orderID: string, @Res() res: Response) {
    try {
      const { jsonResponse, httpStatusCode } = await this.paypalAPI.capturePayment(orderID);
      res.status(httpStatusCode).json(jsonResponse);
    } catch (error) {
      console.error("Failed to capture order:", error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Failed to capture order." });
    }
  }
}