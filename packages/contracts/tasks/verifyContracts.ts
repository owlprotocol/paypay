import { task } from 'hardhat/config';

task('verifyContracts', 'Verify contracts on Etherscan').setAction(async (args, hre) => {
    const { deployments } = hre;
    // const { deployer, other } = await getNamedAccounts();
    // const [lender, borrower] = [deployer, other];

    // Get OwlhouseFactory
    const verifyAddresses = ['OwlhouseFactoryV3', 'OwlNFT', 'OwlToken'];

    for (const contract of verifyAddresses) {
        const { address } = await deployments.get(contract);
        await hre.run('verify:verify', {
            address: address,
            constructorArguments: [],
        });
    }
});
