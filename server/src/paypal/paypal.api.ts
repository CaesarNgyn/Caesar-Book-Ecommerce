import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
const PAYPAL_API_BASE = 'https://api-m.sandbox.paypal.com';

export default class PayPalAPI {
  private readonly CLIENT_ID: string;
  private readonly CLIENT_SECRET: string;

  constructor(private readonly configService: ConfigService) {
    this.CLIENT_ID = configService.get<string>("PAYPAL_CLIENT_ID");
    this.CLIENT_SECRET = configService.get<string>("PAYPAL_CLIENT_SECRET");
  }

  async createOrder(data: any) {
    const accessToken = await this.getAccessToken();
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: data.product.price
            }
          }
        ]
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create PayPal order');
    }

    const responseData = await response.json();
    return {
      jsonResponse: responseData, // Response data from the API
      httpStatusCode: response.status, // HTTP status code
    };
  }

  async capturePayment(orderId: any) {
    const accessToken = await this.getAccessToken();
    const response = await fetch(`${PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // console.log("res>", response)
    if (!response.ok) {
      throw new Error('Failed to capture PayPal order');
    }
    const responseData = await response.json();
    return {
      jsonResponse: responseData, // Response data from the API
      httpStatusCode: response.status, // HTTP status code
    };
  }

  async getAccessToken() {
    const auth = Buffer.from(this.CLIENT_ID + ":" + this.CLIENT_SECRET).toString("base64")
    const response = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
      method: 'POST',
      body: 'grant_type=client_credentials',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get PayPal access token');
    }

    const responseData: any = await response.json();
    return responseData.access_token;
  }
}

