import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as Kavenegar from 'kavenegar';
import * as dotenv from 'dotenv';

dotenv.config();

interface CustomVerifyLookupOptions {
  receptor: string;
  token: string;
  token2?: string;
  token3?: string;
  token20: string;
  template: string;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  async sendSMS(phones: string | string[], smsText: string): Promise<void> {
    const sender = '10004400064000';
    const phoneNumbers = Array.isArray(phones) ? phones : [phones];
    const batchSize = 200;
    const totalNumbers = phoneNumbers.length;
    let currentIndex = 0;

    while (currentIndex < totalNumbers) {
      const batchNumbers = phoneNumbers.slice(
        currentIndex,
        currentIndex + batchSize,
      );
      const receptor = batchNumbers.join(',');
      // const kavenegarUrl = `https://api.kavenegar.com/v1/${process.env.KAVENEGAR_API_KEY}/sms/send.json?receptor=${receptor}&sender=${sender}&message=${smsText}`;

      // const response = await axios.get(kavenegarUrl);
      this.logger.log(`SMS >>> ${receptor}`);

      currentIndex += batchSize;
    }
  }

  async sendSignUpSMS(
    phones: string | string[],
    username: string,
    pass: string,
  ): Promise<void> {
    const phoneNumbers = Array.isArray(phones) ? phones : [phones];
    const batchSize = 200;
    const totalNumbers = phoneNumbers.length;
    const OtpApi = Kavenegar.KavenegarApi({
      apikey: process.env.KAVENEGAR_API_KEY as string,
    });

    let currentIndex = 0;
    while (currentIndex < totalNumbers) {
      const batchNumbers = phoneNumbers.slice(
        currentIndex,
        currentIndex + batchSize,
      );

      await Promise.all(
        batchNumbers.map((phone) => {
          return new Promise((resolve, reject) => {
            OtpApi.VerifyLookup(
              {
                receptor: phone,
                token: username,
                token2: pass,
                template: 'sendSignup',
              },
              (response, status) => {
                if (status === 200) {
                  this.logger.log(
                    `Message sent to ${phone} with status: ${status}`,
                  );
                  resolve(response);
                } else {
                  this.logger.error(
                    `Failed to send message to ${phone} with status: ${status}`,
                  );
                  reject(new Error(`Failed with status: ${status}`));
                }
              },
            );
          });
        }),
      );
      currentIndex += batchSize;
    }
  }

  async sendClassTimeSMS(
    phones: string | string[],
    smsText: string,
  ): Promise<void> {
    const phoneNumbers = Array.isArray(phones) ? phones : [phones];
    const batchSize = 200;
    const totalNumbers = phoneNumbers.length;
    const OtpApi = Kavenegar.KavenegarApi({
      apikey: process.env.KAVENEGAR_API_KEY as string,
    });

    let currentIndex = 0;
    while (currentIndex < totalNumbers) {
      const batchNumbers = phoneNumbers.slice(
        currentIndex,
        currentIndex + batchSize,
      );

      await Promise.all(
        batchNumbers.map((phone) => {
          return new Promise((resolve, reject) => {
            const options: CustomVerifyLookupOptions = {
              receptor: phone,
              token: '.',
              token20: smsText,
              template: 'classTime',
            };
            OtpApi.VerifyLookup(options, (response, status) => {
              if (status === 200) {
                this.logger.log(
                  `Message sent to ${phone} with status: ${status}`,
                );
                resolve(response);
              } else {
                this.logger.error(
                  `Failed to send message to ${phone} with status: ${status}`,
                );
                reject(new Error(`Failed with status: ${status}`));
              }
            });
          });
        }),
      );

      currentIndex += batchSize;
    }
  }
}
