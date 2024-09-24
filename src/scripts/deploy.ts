import { ethers } from "hardhat"; // Correct import from Hardhat

async function main() {
  const [deployer] = await ethers.getSigners(); // Use ethers from Hardhat
  console.log("Deploying contracts with the account:", deployer.address);

  const NFT = await ethers.getContractFactory("NFT"); // Get contract factory
  const nft = await NFT.deploy(); // Deploy contract
  await nft.deployed(); // Wait for deployment to complete

  console.log("NFT contract deployed to:", nft.address); // Output deployed contract address
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
