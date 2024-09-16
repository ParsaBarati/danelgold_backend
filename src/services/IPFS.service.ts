import { Injectable } from '@nestjs/common';
import { create } from 'ipfs-http-client';

@Injectable()
export class IPFSService {
  private ipfs: Awaited<ReturnType<typeof create>>;

  constructor() {
    this.ipfs = create({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
      headers: {
        authorization: 'Basic ' + Buffer.from('<projectId>:<projectSecret>').toString('base64'),
      },
    });
  }

  async uploadToIPFS(content: Buffer | string): Promise<string> {
    try {
      const result = await this.ipfs.add(content);
      return `https://ipfs.infura.io/ipfs/${result.path}`;
    } catch (error) {
      throw new Error(`Error uploading to IPFS: ${error}`);
    }
  }

  async uploadMetadataToIPFS(metadata: Record<string, any>): Promise<string> {
    const metadataBuffer = Buffer.from(JSON.stringify(metadata));
    return this.uploadToIPFS(metadataBuffer);
  }
}
