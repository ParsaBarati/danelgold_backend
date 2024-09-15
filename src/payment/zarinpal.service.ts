import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException } from '@nestjs/common';

@Injectable()
export class ZarinpalService {
  private readonly merchantId: string = process.env.ZARINPAL_MERCHANT_ID;
  private readonly zarinpalRequestUrl: string =
    process.env.ZARINPAL_LINK_REQUEST;
  private readonly zarinpalVerifyUrl: string = process.env.ZARINPAL_LINK_VERIFY;
  private readonly callbackUrl: string = process.env.CALLBACKURL_ZARIPAL;

  constructor(private readonly httpService: HttpService) {}

  async createPaymentRequest(
    amount: number,
    transaction: string,
    type: 'wallet' | 'order' | 'debtDueDate',
  ): Promise<{ url: string; authority: string }> {
    const callbackurl = `${this.callbackUrl}/${type}?transaction=${transaction}`;

    const roundedAmount = Math.round(amount);

    const response = await this.httpService
      .post(this.zarinpalRequestUrl, {
        merchant_id: this.merchantId,
        amount: roundedAmount * 10, // تبدیل تومان به ریال
        callback_url: callbackurl,
        description: 'توضیحات پرداخت',
      })
      .toPromise();

    const data = response.data.data;
    const errors = response.data.errors;

    if (errors.length > 0) {
      throw new HttpException(
        {
          status: errors[0].code,
          message: errors[0].message,
        },
        400,
      );
    }

    if (data.code !== 100) {
      throw new HttpException(
        {
          status: data.code,
          message: 'خطا در ایجاد درخواست پرداخت',
        },
        400,
      );
    }

    return {
      url: `https://www.zarinpal.com/pg/StartPay/${data.authority}`,
      authority: data.authority,
    };
  }

  async verifyPayment(amount: number, authority: string): Promise<any> {
    const response = await this.httpService
      .post(this.zarinpalVerifyUrl, {
        merchant_id: this.merchantId,
        amount: amount * 10, // تبدیل تومان به ریال
        authority: authority,
      })
      .toPromise();

    console.log(JSON.stringify(`response  >>> ${response}`));

    console.log(JSON.stringify(`response.data  >>> ${response.data}`));

    const data = response.data.data;
    const errors = response.data.errors;

    console.log(JSON.stringify(response.data.errors));

    if (errors.length > 0) {
      throw new HttpException(
        {
          status: errors[0].code,
          message: errors[0].message,
        },
        400,
      );
    }

    return data;
  }
}
