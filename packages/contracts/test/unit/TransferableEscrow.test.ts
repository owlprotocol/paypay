import { ethers } from 'hardhat';
import { expect } from 'chai';
import { TransferableEscrow, OwlNFT, OwlToken, OwlhouseFactory } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

describe('TransferableEscrow Test Suite', async () => {
    // let TransferableEscrowFactory: TransferableEscrow__factory;

    let borrowerToken: OwlNFT;
    let lenderToken: OwlNFT;
    let assetToken: OwlNFT;
    let OwlhouseFactory: OwlhouseFactory;

    let borrower: SignerWithAddress;
    let lender: SignerWithAddress;
    let paymentToken: OwlToken;

    const blockTime = async () => {
        const blockNum = await ethers.provider.getBlockNumber();
        const block = await ethers.provider.getBlock(blockNum);
        return block.timestamp;
    };

    const nextBlockTime = async (s: number) => {
        await ethers.provider.send('evm_increaseTime', [s]);
        //@ts-ignore
        await ethers.provider.send('evm_mine'); // this one will have 02:00 PM as its timestamp
    };

    const logPaymentStatus = async (c: TransferableEscrow) => {
        const { loanStart, loanEnd, weiPaid, weiPerSecond } = await c.paymentStatus();
        console.log({
            currentTimestamp: await blockTime(),
            currentOwed: (await c.totalOwedNow()).toString(),
            owedAtEnd: (await c.totalOwedAtEnd()).toString(),
            hasDefaulted: await c.hasDefaulted(),
            paymentsComplete: await c.paymentsComplete(),
            lender: await c.getLender(),
            borrower: await c.getBorrower(),
            loanStart: loanStart.toString(),
            loanEnd: loanEnd.toString(),
            weiPaid: weiPaid.toString(),
            weiPerSecond: weiPerSecond.toString(),
        });
    };

    before(async () => {
        const ERC721Factory = await ethers.getContractFactory('OwlNFT');
        const ERC20Factory = await ethers.getContractFactory('OwlToken');
        const OwlhouseFactoryFactory = await ethers.getContractFactory('OwlhouseFactory');

        assetToken = (await ERC721Factory.deploy('AssetToken', 'ASST', 'IPFS-HASH')) as OwlNFT;
        paymentToken = (await ERC20Factory.deploy()) as OwlToken;
        OwlhouseFactory = (await OwlhouseFactoryFactory.deploy()) as OwlhouseFactory;

        // Signers
        [lender, borrower] = await ethers.getSigners();

        // Get some test tokens
        await paymentToken.mint(borrower.address, '10000000000000000000000');

        // Pre-approve all transfers
        await assetToken.setApprovalForAll(OwlhouseFactory.address, true);
    });

    it.skip('Increasing owed', async () => {
        // Token Ids
        const nftAssetId = 1;
        await assetToken.safeMint(lender.address, nftAssetId);

        // Loan start: t-3 seconds
        const start = await blockTime();
        const end = start + 10;
        const loanAmount = 100;

        const escrowTX = await OwlhouseFactory.deployEscrow(
            lender.address,
            borrower.address,
            assetToken.address,
            paymentToken.address,
            nftAssetId,
            start,
            end,
            loanAmount,
        );

        const receipt = await escrowTX.wait();

        // debug logs
        //@ts-ignore
        for (const event of receipt.events) {
            console.log(`Event ${event.event} with args ${event.args}`);
        }

        // Get escrow address
        const escrowAddress = await assetToken.ownerOf(nftAssetId);

        console.log(`Escrow: ${JSON.stringify(escrowAddress)}`);

        const TransferableEscrow = await ethers.getContractAt('TransferableEscrow', escrowAddress);

        console.log(`Start timestamp: ${await blockTime()}`);

        // See loan amount
        for (const _ of [0, 0, 0, 0, 0]) {
            console.log(`Amount owed: ${await TransferableEscrow.totalOwedNow()}`);
            // Up timestamp 3 seconds
            nextBlockTime(3);
        }

        console.log(`Finished @${await blockTime()}`);
    });

    it('Attempt make payments', async () => {
        // Token Ids
        const nftAssetId = 2;
        await assetToken.safeMint(lender.address, nftAssetId);

        // Loan start: t-3 seconds
        const start = await blockTime();
        const end = start + 20;
        const loanAmount = 100;

        await OwlhouseFactory.deployEscrow(
            lender.address,
            borrower.address,
            assetToken.address,
            paymentToken.address,
            nftAssetId,
            start,
            end,
            loanAmount,
        );

        // Get escrow address
        const escrowAddress = await assetToken.ownerOf(nftAssetId);
        // Approve escrow transfers
        await paymentToken.connect(borrower).increaseAllowance(escrowAddress, '10000000000000000000000');

        // Grab contract obj
        const TransferableEscrowContract = (await ethers.getContractAt(
            'TransferableEscrow',
            escrowAddress,
        )) as TransferableEscrow;

        // Probably defaulted currently
        await logPaymentStatus(TransferableEscrowContract);

        // Make payment
        await TransferableEscrowContract.connect(borrower).makePayment(20);
        await logPaymentStatus(TransferableEscrowContract);

        // Bump time
        await nextBlockTime(10);
        await logPaymentStatus(TransferableEscrowContract);

        // Make last payment
        await TransferableEscrowContract.connect(borrower).makePayment(80);
        await logPaymentStatus(TransferableEscrowContract);

        // Bump timpe
        await nextBlockTime(200);
        await logPaymentStatus(TransferableEscrowContract);

        console.log(`Finished @${await blockTime()}`);
    });
});
