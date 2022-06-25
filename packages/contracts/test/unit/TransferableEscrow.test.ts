import { ethers } from 'hardhat';
import { expect } from 'chai';
import { TransferableEscrow, OwlNFT } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('TranserableEscrow Test Suite', async () => {
    // let TransferableEscrowFactory: TransferableEscrow__factory;

    let borrowerToken: OwlNFT;
    let lenderToken: OwlNFT;
    let assetToken: OwlNFT;

    let borrower: SignerWithAddress;
    let lender: SignerWithAddress;

    before(async () => {
        const ERC721Factory = await ethers.getContractFactory('OwlNFT');

        // borrowerToken = (await ERC721Factory.deploy('LenderToken', 'LNDR', 'IPFS-HASH')) as OwlNFT;
        // lenderToken = (await ERC721Factory.deploy('BorrowerToken', 'BRWR', 'IPFS-HASH')) as OwlNFT;
        assetToken = (await ERC721Factory.deploy('AssetToken', 'ASST', 'IPFS-HASH')) as OwlNFT;

        // await Promise.all([borrowerToken.deployed(), lenderToken.deployed(), assetToken.deployed()]);

        [borrower, lender] = await ethers.getSigners();
    });

    it('Example Contract', async () => {
        // TODO - mint returns

        // Token Ids
        // const borrowerTokenId = 1;
        // await borrowerToken.safeMint(borrower.address, borrowerTokenId);
        // const lenderTokenId = 1;
        // await lenderToken.safeMint(lender.address, lenderTokenId);
        const nftAssetId = 1;
        await assetToken.safeMint(lender.address, nftAssetId);

        // Setup Transfer Escrow

        const TransferableEscrowFactory = await ethers.getContractFactory('TransferableEscrow');
        const TransferableEscrowContract = await TransferableEscrowFactory.deploy();
        await TransferableEscrowContract.deployed();

        console.log('Deployed!');
        console.log(`Tokens: ${JSON.stringify(borrowerTokenId)} ${JSON.stringify(lenderTokenId)}`);

        // // const sum = await TransferableEscrowContract.sum(1, 2);
        // expect(sum).to.equal(3);
    });
});
