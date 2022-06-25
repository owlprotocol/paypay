// import logo from './logo.svg';
import { Container, Row } from 'reactstrap';
import styled from 'styled-components';
import { HeaderNav } from './components';

const AppWrapper = styled.div`
    padding: 0 24px;
`;

const Body = styled.div`

`;

function App() {
    return (
        <AppWrapper>
            <Container>
                <HeaderNav />
                <Body>
                    <Row>
                        Hello World
                    </Row>
                </Body>
            </Container>
        </AppWrapper>
    );
}

export default App;
