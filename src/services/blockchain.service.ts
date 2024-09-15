import { Injectable } from '@nestjs/common';
import Web3 from 'web3';

@Injectable()
export class BlockchainService {
  private web3: Web3;

  constructor() {
    this.web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'));
  }

  async getBalance(address: string): Promise<string> {
    const balance = await this.web3.eth.getBalance(address);
    return this.web3.utils.fromWei(balance, 'ether');
  }

  async sendTransaction(
    from: string, 
    to: string, 
    value: string, 
    privateKey: string
): Promise<any> {
    const tx = {
      from,
      to,
      value: this.web3.utils.toWei(value, 'ether'),
      gas: 21000,
    };

    const signedTx = await this.web3.eth.accounts.signTransaction(tx, privateKey);
    const receipt = await this.web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt.transactionHash;
  }
}
