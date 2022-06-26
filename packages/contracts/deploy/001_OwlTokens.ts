import { ethers, network } from 'hardhat';
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const deploy: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    //@ts-ignore
    const { deployments, getNamedAccounts } = hre;
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    await deploy('OwlToken', {
        from: deployer,
        args: [],
        log: true,
    });

    await deploy('OwlNFT', {
        from: deployer,
        args: ['OwlNFT', 'ONFT', 'IPFS-HASH'],
        log: true,
    });
};

export default deploy;