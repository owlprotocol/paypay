// import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo-paypay.png';
import logoText from '../../assets/logo-paypay-text_only.png';
import styled from 'styled-components';
import walletIcon from '../../assets/metamask-dot.png';
import { Button, Flex, Box, Spacer, Image } from '@chakra-ui/react';

import { useAccount, useConnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';

const Header = styled(Flex)`
    padding: 12px 0;
`;

const HeaderNav = () => {
    const { data: account } = useAccount();
    // @ts-ignore
    // const { data: ensName } = useEnsName({ address: account.address });
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    });

    const accountAddress = account && account.address ? account.address : '';

    return (
        <Header>
            <Flex>
                <img src={logo} style={{ height: 45 }} alt="logo" />
                <Box mt={3} ml={2}>
                    <img src={logoText} style={{ height: 45 }} alt="logo-text" />
                </Box>
            </Flex>

            <Spacer />

            <Box>MENU</Box>

            <Spacer />

            <Box>
                <Button mr={3}>ETH</Button>

                <Button variant="walletConnect" ml={2} onClick={() => !account && connect()}>
                    {account ? (
                        <Flex>
                            <Image src={walletIcon} w="28px" mr={3} />
                            <Box mt={1}>
                                Connected {account ? `${accountAddress.substr(0, 6)} ...` : ''}
                            </Box>
                        </Flex>):
                        <div>
                            Connect
                        </div>
                    }
                </Button>
            </Box>
        </Header>
    );
};

export default HeaderNav;
