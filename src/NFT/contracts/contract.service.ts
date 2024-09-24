import { Injectable } from '@nestjs/common';
import { JsonRpcProvider, Contract } from 'ethers'; 
@Injectable()
export class ContractService {
    private provider: JsonRpcProvider;
    private contract: Contract;
    private readonly contractAddress = 'YOUR_CONTRACT_ADDRESS_HERE';
    private readonly abi = [
    ];

    constructor() {
        this.provider = new JsonRpcProvider('http://localhost:8545'); 
        this.initializeContract();
    }

    private async initializeContract() {
        const signer = await this.provider.getSigner(); 
        this.contract = new Contract(this.contractAddress, this.abi, signer);
    }

    async mintNFT(to: string, tokenURI: string): Promise<void> {
        const tx = await this.contract.mint(to, tokenURI);
        await tx.wait();
    }

    async getTokenURI(tokenId: number): Promise<string> {
        return await this.contract.tokenURI(tokenId);
    }
}
