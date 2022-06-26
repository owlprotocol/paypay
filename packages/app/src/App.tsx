// import logo from './logo.svg';
import { Container } from '@chakra-ui/react';
import styled from 'styled-components';
import { HeaderNav } from './components';
import { LoanList } from './screens';

import { WagmiConfig, createClient, chain, configureChains } from 'wagmi'

import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/800.css';

import { infuraProvider } from 'wagmi/providers/infura';
import { InjectedConnector } from 'wagmi/connectors/injected';

const infuraId = '66117717d0b044a2a8c7fe221a0c0000';

const { chains, provider } = configureChains(
    [chain.rinkeby],
    [infuraProvider({ infuraId })],
)

const wagmiClient = createClient({
    autoConnect: true,
    connectors: [new InjectedConnector({ chains })],
    provider,
});

const AppWrapper = styled.div`
    padding: 0 24px;
`;

function App() {
    return (
        <WagmiConfig client={wagmiClient}>
            <AppWrapper>
                <Container maxW="container.xl">
                    <HeaderNav />
                    <LoanList />
                </Container>
            </AppWrapper>
        </WagmiConfig>
    );
}

export default App;
