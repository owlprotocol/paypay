// import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import styled from 'styled-components';
import { ReactComponent as WalletIcon } from '../../assets/wallet.svg';
import { Button, Flex, Box, Spacer } from '@chakra-ui/react';

const Header = styled(Flex)`
    padding: 12px 0;
`;

const HeaderNav = () => (
    <Header>
        <Box>
            <img src={logo} style={{ float: 'left', height: 45 }} alt="logo" />
        </Box>

        <Spacer />

        <Box>MENU</Box>

        <Spacer />

        <Box>
            <Button mr={3}>ETH</Button>

            <Button>
                <WalletIcon width="28px" /> &nbsp;Connect
            </Button>
        </Box>
    </Header>
);

export default HeaderNav;
