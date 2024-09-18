import { Injectable } from '@nestjs/common';
import axios from 'axios';
import FormData from 'form-data';

@Injectable()
export class IPFSService {
  private readonly pinataEndpoint = 'https://api.pinata.cloud/pinning/pinFileToIPFS';
  private readonly pinataMetadataEndpoint = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';
  
  // Using JWT for authentication
  private readonly pinataJWT = process.env.PINATA_JWT; 

  private getHeaders(form: FormData) {
    return {
      headers: {
        Authorization: `Bearer ${this.pinataJWT}`, // Using JWT token for authorization
        ...form.getHeaders(),
      },
    };
  }

  // Upload file to IPFS
  async uploadFileToIPFS(file: Express.Multer.File): Promise<string> {
    const form = new FormData();
    form.append('file', file.buffer, file.originalname);

    try {
      const response = await axios.post(this.pinataEndpoint, form, this.getHeaders(form));
      return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading file to IPFS:', error);
      throw new Error('IPFS file upload failed');
    }
  }

  // Upload metadata to IPFS
  async uploadMetadataToIPFS(metadata: any): Promise<string> {
    const form = new FormData();
    form.append('metadata', JSON.stringify(metadata));

    try {
      const response = await axios.post(this.pinataMetadataEndpoint, form, this.getHeaders(form));
      return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    } catch (error) {
      console.error('Error uploading metadata to IPFS:', error);
      throw new Error('IPFS metadata upload failed');
    }
  }
}
