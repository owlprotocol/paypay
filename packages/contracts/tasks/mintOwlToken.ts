import { task } from 'hardhat/config';
import { OwlNFT, OwlNFTV2, OwlToken } from '../typechain';

task('mintOwlToken', 'Mints into owlToken')
    .addParam('walletAddress', 'wallet to mint HTS tokens to')
    .setAction(async (args, hre) => {
        const { deployments, ethers } = hre;

        const { address } = await deployments.get('OwlToken');
        const OwlTokenContract = (await ethers.getContractAt('OwlToken', address)) as OwlToken;

        // Get some test tokens
        await OwlTokenContract.mint(args.walletAddress, '10000000000000000000000');
    });

task('mintOwlNFT', 'Mints Owl NFT')
    .addParam('walletAddress', 'wallet to mint HTS tokens to')
    .addParam('tokenId', 'token identifier to mint')
    .setAction(async (args, hre) => {
        const { deployments, ethers } = hre;

        const { address } = await deployments.get('OwlNFT');
        const OwlNFTContract = (await ethers.getContractAt('OwlNFT', address)) as OwlNFT;

        // Get some test tokens
        await OwlNFTContract.safeMint(args.walletAddress, args.tokenId);
    });

task('mintOwlNFTV2', 'Mints Owl NFT')
    .addParam('walletAddress', 'wallet to mint HTS tokens to')
    .addParam('tokenId', 'token identifier to mint')
    .addParam('uri', 'metadata to pin to NFT')
    .setAction(async (args, hre) => {
        const { deployments, ethers } = hre;

        const { address } = await deployments.get('OwlNFTV2');
        const OwlNFTContract = (await ethers.getContractAt('OwlNFTV2', address)) as OwlNFTV2;

        // Get some test tokens
        await OwlNFTContract.safeMint(args.walletAddress, args.tokenId, args.uri);
    });
