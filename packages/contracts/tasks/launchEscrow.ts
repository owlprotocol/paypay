import { task } from 'hardhat/config';
//@ts-ignore eslint-disable-next-line import/no-unresolved import/no-unresolved
// eslint-disable-next-line
import { OwlhouseFactoryV3, OwlNFT, OwlToken } from '../typechain';

task('launchEscrow', 'Prints an accounts balance')
    .addParam('tokenId', 'Numeric token id to mint')
    .setAction(async (args, hre) => {
        const { deployments, getNamedAccounts, ethers } = hre;
        const { deployer, other } = await getNamedAccounts();
        const [lender, borrower] = [deployer, other];

        const blockTime = async () => {
            const blockNum = await ethers.provider.getBlockNumber();
            const block = await ethers.provider.getBlock(blockNum);
            return block.timestamp;
        };

        // Get OwlhouseFactory
        let { address } = await deployments.get('OwlhouseFactoryV3');
        const OwlhouseFactoryContract = (await ethers.getContractAt('OwlhouseFactoryV3', address)) as OwlhouseFactoryV3;

        ({ address } = await deployments.get('OwlNFT'));
        const OwlNFTContract = (await ethers.getContractAt('OwlNFT', address)) as OwlNFT;

        ({ address } = await deployments.get('OwlToken'));
        const OwlTokenContract = (await ethers.getContractAt('OwlToken', address)) as OwlToken;

        // Get some test tokens
        await OwlTokenContract.mint(borrower, '10000000000000000000000');

        // Pre-approve all transfers
        await OwlNFTContract.setApprovalForAll(OwlhouseFactoryContract.address, true);

        // Mint nft id
        await OwlNFTContract.safeMint(lender, args.tokenId);

        // Start time
        const start = await blockTime();
        const end = start + 3600;

        await OwlhouseFactoryContract.deployEscrow(
            lender,
            borrower,
            OwlNFTContract.address,
            OwlTokenContract.address,
            args.tokenId,
            start,
            end,
            100_000,
            10_000,
            {
                gasLimit: 750_000,
            },
        );

        console.log({
            OwlToken: OwlTokenContract.address,
            OwlAsset: OwlNFTContract.address,
            OwlhouseFactory: OwlhouseFactoryContract.address,
        });
    });
