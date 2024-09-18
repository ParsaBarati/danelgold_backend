import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { readFileSync } from 'fs';

@Injectable()
export class PinataService {
  private readonly apiKey = process.env.PINATA_API_KEY!;
  private readonly apiSecret = process.env.PINATA_API_SECRET!;

  async uploadFile(filePath: string): Promise<any> {
    const form = new FormData();
    form.append('file', readFileSync(filePath));

    try {
      const response = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', form, {
        headers: {
          'pinata-api-key': this.apiKey,
          'pinata-api-secret': this.apiSecret,
          ...form.getHeaders(),
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Error uploading file: ${error}`);
    }
  }
}
