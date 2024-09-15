import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
} from '@nestjs/common';
import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class CaptchaMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');

    const token = req.body['arcaptcha-token'];
    console.log(`Received CAPTCHA token: ${token}`);

    if (!token) {
      throw new BadRequestException('خطای کپچا');
    }

    const verificationResult = await this.verifyCaptcha(token);

    if (!verificationResult.success) {
      throw new BadRequestException('خطای حل کپچا');
    }

    next();
  }

  private async verifyCaptcha(token: string) {
    const secretKey = process.env.CAPTCHA_SECRET_KEY;
    const siteKey = process.env.CAPTCHA_SITE_KEY;
    const verifyUrl = 'https://api.arcaptcha.co/arcaptcha/api/verify';

    const data = {
      secret_key: secretKey,
      challenge_id: token,
      site_key: siteKey,
    };

    const response = await axios.post(verifyUrl, data);
    const responseData = response.data;
    console.log(`responseData >>>>>>> ${JSON.stringify(responseData)}`);

    if (responseData.success) {
      return { success: true, score: responseData.score };
    } else {
      return { success: false, score: responseData.score };
    }
  }
}
