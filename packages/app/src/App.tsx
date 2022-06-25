// import logo from './logo.svg';
import { Container } from '@chakra-ui/react';
import styled from 'styled-components';
import { HeaderNav } from './components';
import { LoanList } from './screens';

const AppWrapper = styled.div`
    padding: 0 24px;
`;

const Body = styled.div`;

`;

function App() {
    return (
        <AppWrapper>
            <Container maxW="container.xl">
                <HeaderNav />
                <Body>
                    <LoanList />
                </Body>
            </Container>
        </AppWrapper>
    );
}

export default App;
