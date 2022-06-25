// import logo from './logo.svg';
import { Container } from '@chakra-ui/react';
import styled from 'styled-components';
import { HeaderNav } from './components';
import { LoanList } from './screens';

import '@fontsource/manrope/400.css';
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/manrope/800.css';

const AppWrapper = styled.div`
    padding: 0 24px;
`;

function App() {
    return (
        <AppWrapper>
            <Container maxW="container.xl">
                <HeaderNav />
                <body>
                    <LoanList />
                </body>
            </Container>
        </AppWrapper>
    );
}

export default App;
