// import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import styled from 'styled-components';
import walletIcon from '../../assets/metamask-dot.png';
import { Button, Flex, Box, Spacer, Image } from '@chakra-ui/react';

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

            <Button variant="walletConnect" ml={2}>
                <Image src={walletIcon} w="28px" mr={3} /> Connect
            </Button>
        </Box>
    </Header>
);

export default HeaderNav;
