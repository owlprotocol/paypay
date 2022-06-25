import { ethers, network } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { TransferableEscrow } from '../typechain';

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    //@ts-ignore
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { other } = await getNamedAccounts();

    if (network.name === 'hardhat') {
        await deploy('TransferableEscrow', {
            from: other,
            args: [],
            log: true,
        });

        const { address } = await deployments.get('TransferableEscrow');

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const TransferableEscrowContract = (await ethers.getContractAt(
            'TransferableEscrow',
            address,
        )) as TransferableEscrow;
    }
};

export default deploy;
