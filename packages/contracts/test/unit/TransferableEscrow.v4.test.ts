const { toWad } = require('@decentral.ee/web3-helpers');

import { ethers, web3 } from 'hardhat';
import { expect } from 'chai';
import { TransferableEscrowV3, OwlNFT, OwlhouseFactoryV3 } from '../../typechain';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';

import { Framework } from '@superfluid-finance/sdk-core';
const daiABI = require('../../abis/fDAIABI');

//SUPERFLUID

const deployFramework = require('@superfluid-finance/ethereum-contracts/scripts/deploy-framework');
const deployTestToken = require('@superfluid-finance/ethereum-contracts/scripts/deploy-test-token');
const deploySuperToken = require('@superfluid-finance/ethereum-contracts/scripts/deploy-super-token');

let sf: InstanceType<any>;
let paymentToken: InstanceType<typeof daiABI>;
let paymentTokenX: InstanceType<typeof daiABI>;
let superSigner: InstanceType<typeof sf.createSigner>;

const errorHandler = (err: any) => {
    if (err) throw err;
};

describe('TransferableEscrow V4 Test Suite', async () => {
    let borrower: SignerWithAddress;
    let lender: SignerWithAddress;
    let assetToken: InstanceType<typeof daiABI>;
    let OwlhouseFactory: OwlhouseFactoryV3;

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

    const logPaymentStatus = async (c: TransferableEscrowV3) => {
        const { loanStart, loanEnd, weiPaid, weiPerSecondPrinciple, weiPerSecondInterest } = await c.paymentInfo();

        console.log({
            currentTimestamp: await blockTime(),
            currentOwed: (await c.totalOwedNow()).toString(),
            owedAtEnd: (await c.totalOwedAtEnd()).toString(),
            hasDefaulted: await c.hasDefaulted(),
            paymentsComplete: await c.paymentsComplete(await blockTime()),
            lender: await c.getLender(),
            borrower: await c.getBorrower(),
            loanStart: loanStart.toString(),
            loanEnd: loanEnd.toString(),
            weiPaid: weiPaid.toString(),
            weiPerSecondPrinciple: weiPerSecondPrinciple.toString(),
            weiPerSecondInterest: weiPerSecondInterest.toString(),
        });
    };

    before(async () => {
        // Superfluid init

        const [deployer] = await ethers.getSigners();

        //deploy the framework
        await deployFramework(errorHandler, {
            web3,
            from: deployer.address,
        });

        //initialize the superfluid framework...put custom and web3 only bc we are using hardhat locally
        sf = await Framework.create({
            networkName: 'custom',
            provider: web3,
            dataMode: 'WEB3_ONLY',
            resolverAddress: process.env.RESOLVER_ADDRESS, //this is how you get the resolver address
            protocolReleaseVersion: 'test',
        });

        //deploy a fake erc20 token
        const fDAIAddress = await deployTestToken(errorHandler, [':', 'fDAI'], {
            web3,
            from: deployer.address,
        });

        //deploy a fake erc20 wrapper super token around the fDAI token
        const fDAIxAddress = await deploySuperToken(errorHandler, [':', 'fDAI'], {
            web3,
            from: deployer.address,
        });

        superSigner = await sf.createSigner({
            signer: deployer,
            provider: web3,
        });

        //use the framework to get the super token
        paymentTokenX = await sf.loadSuperToken('fDAIx');

        //get the contract object for the erc20 token
        const paymentTokenAddress = paymentTokenX.underlyingToken.address;
        paymentToken = new ethers.Contract(paymentTokenAddress, daiABI, deployer);

        // let TransferableEscrowFactory: TransferableEscrow__factory;

        const ERC721Factory = await ethers.getContractFactory('OwlNFT');
        const ERC20Factory = await ethers.getContractFactory('OwlToken');
        const OwlhouseFactoryFactory = await ethers.getContractFactory('OwlhouseFactoryV3');

        assetToken = (await ERC721Factory.deploy('AssetToken', 'ASST', 'IPFS-HASH')) as OwlNFT;
        OwlhouseFactory = (await OwlhouseFactoryFactory.deploy()) as OwlhouseFactoryV3;

        // Signers
        [lender, borrower] = await ethers.getSigners();

        // Get some test tokens
        const amount = ethers.utils.parseEther('100000');
        await paymentToken.mint(borrower.address, amount);
        await paymentToken.connect(borrower).approve(paymentTokenX.address, amount);

        const paymentTokenXUpgradeOperation = paymentTokenX.upgrade({
            amount,
        });

        await paymentTokenXUpgradeOperation.exec(borrower);

        const paymentTokenXBal = await paymentTokenX.balanceOf({
            account: borrower.address,
            providerOrSigner: borrower,
        });
        console.log('paymentTokenX bal for borrower: ', ethers.utils.formatEther(paymentTokenXBal));

        // Pre-approve all transfers
        await assetToken.setApprovalForAll(OwlhouseFactory.address, true);
    });

    it('Attempt make payments', async () => {
        // Token Ids
        const nftAssetId = 2;
        await assetToken.safeMint(lender.address, nftAssetId);

        // Loan start: t-3 seconds
        const start = await blockTime();
        const end = start + 20;
        const loanAmount = 100;
        const interestAmount = 50;

        console.log(paymentTokenX.address);

        await OwlhouseFactory.deployEscrow(
            lender.address,
            borrower.address,
            assetToken.address,
            paymentTokenX.address,
            nftAssetId,
            start,
            end,
            loanAmount,
            interestAmount,
        );

        // Get escrow address
        const escrowAddress = await assetToken.ownerOf(nftAssetId);
        // start a stream
        const createFlowOperation = await sf.cfaV1.createFlow({
            receiver: escrowAddress,
            superToken: paymentTokenX.address,
            flowRate: toWad((loanAmount + interestAmount) / (end - start)).toString(),
        });
        await createFlowOperation.exec(borrower);

        // Grab contract obj
        const TransferableEscrowContract = (await ethers.getContractAt(
            'TransferableEscrowV3',
            escrowAddress,
        )) as TransferableEscrowV3;

        // Probably defaulted currently
        console.log('Initial status: no payments');
        await logPaymentStatus(TransferableEscrowContract);

        // Bump time
        await nextBlockTime(10);
        console.log('Status +10s');
        await logPaymentStatus(TransferableEscrowContract);

        // Bump timpe
        await nextBlockTime(200);
        console.log('Status +200s');
        await logPaymentStatus(TransferableEscrowContract);

        // withdraw
        await TransferableEscrowContract.withdrawPayment();
        console.log('lender balance:', ethers.utils.formatEther(await paymentToken.balanceOf(lender.address)));

        // claim nft
        await TransferableEscrowContract.connect(borrower).claimAssetNFT();
        console.log('is borrower owner of nft now?', (await assetToken.ownerOf(nftAssetId)) == borrower.address);

        console.log(`Finished @${await blockTime()}`);
    });
});
