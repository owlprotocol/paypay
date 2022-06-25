import { ethers } from 'hardhat';
import { expect } from 'chai';
import { TransferableEscrow, OwlNFT, OwlToken } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('TransferableEscrow Test Suite', async () => {
    // let TransferableEscrowFactory: TransferableEscrow__factory;

    let borrowerToken: OwlNFT;
    let lenderToken: OwlNFT;
    let assetToken: OwlNFT;

    let borrower: SignerWithAddress;
    let lender: SignerWithAddress;
    let paymentToken: OwlToken;

    const now = () => Math.round(Date.now() / 1000);

    before(async () => {
        const ERC721Factory = await ethers.getContractFactory('OwlNFT');
        const ERC20Factory = await ethers.getContractFactory('OwlToken');

        // borrowerToken = (await ERC721Factory.deploy('LenderToken', 'LNDR', 'IPFS-HASH')) as OwlNFT;
        // lenderToken = (await ERC721Factory.deploy('BorrowerToken', 'BRWR', 'IPFS-HASH')) as OwlNFT;
        assetToken = (await ERC721Factory.deploy('AssetToken', 'ASST', 'IPFS-HASH')) as OwlNFT;
        paymentToken = (await ERC20Factory.deploy()) as OwlToken;

        // await Promise.all([borrowerToken.deployed(), lenderToken.deployed(), assetToken.deployed()]);

        [lender, borrower] = await ethers.getSigners();

        await paymentToken.mint(lender.address, '100000000000000000000');
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
        //             paymentToken.address,
        // assetToken.address,
        // borrowerToken
        //
        const OwlhouseFactoryFactory = await ethers.getContractFactory('OwlhouseFactory');
        const OwlhouseFactory = await OwlhouseFactoryFactory.deploy();

        // Loan start: t-3 seconds
        const start = now() + 3;
        const end = start + 10;
        const loanAmount = 100;

        const escrow = await OwlhouseFactory.deployEscrow(
            lender.address,
            borrower.address,
            assetToken.address,
            paymentToken.address,
            nftAssetId,
            start,
            end,
            loanAmount,
        );

        console.log(`Escrow: ${JSON.stringify(escrow)}`);
    });
});
