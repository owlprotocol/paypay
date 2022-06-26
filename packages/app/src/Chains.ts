import { Chain, chain } from 'wagmi';

// *boba
// *optimism 
// *polygon <----
// *skale <----
// rinkeby <--

const supportedChains: Record<string, Chain> = {
    // Supports the graph
    boba: {
        id: 288,
        name: 'Boba',
        network: 'boba',
        rpcUrls: {
            default: 'https://lightning-replica.boba.network',
        },
    },
    // Supports the graph
    optimism: {
        id: 10,
        name: 'Optimism',
        network: 'optimism',
        rpcUrls: {
            default: 'https://mainnet.optimism.io',
        },
    },
    // Supports the graph
    polygon: chain.polygon,
    // **Supports the graph???
    skale: {
        id: 1085866509,
        name: 'Skale',
        network: 'skale',
        rpcUrls: {
            default: 'https://hackathon.skalenodes.com/v1/downright-royal-saiph',
        },
    },
    // Supports the graph
    rinkeby: chain.rinkeby,
};

export default supportedChains;
