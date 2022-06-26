import React, {useState, useCallback, useEffect} from 'react';
import {LoanCard, ModalLoanPay} from '../../components';
import {Flex, useDisclosure} from '@chakra-ui/react';
import moment from 'moment';

// import { useAccount, useConnect, useDisconnect } from 'wagmi'
// import { InjectedConnector } from 'wagmi/connectors/injected'

import nftDummy1 from '../../assets/nft-dummy-1.jpeg';
import nftDummy2 from '../../assets/nft-dummy-2.png';
import nftDummy3 from '../../assets/nft-dummy-3.jpeg';

const tempLoanItems1 = {

    address: '0x9f83eaaa2046fcc139aaa0e786475a843056d5a8',

    // new
    assetNFT: null,
    weiPaid: 300000, // equity owned
    prepaidFunds: 120000, // weiPaid - totalOwedNow() // buffer

    paymentRate: 0.08, //weiPerSecondPrinciple + weiPerSecondInterest

    loanStart: moment.now(),
    loanEnd: moment.now(),

    // old
    name: 'Bored Ape Dummy',
    imageUrl: nftDummy1,
    imageAlt: 'bored-ape-dummy',
    assetValue: 50000,
    equityOwned: 300000,
    interestRate: 0.04,

};

const tempLoanItems2 = {

    address: '0x7232ff16985a3b5bcd96b490461f7703b5d9d136',

    name: 'House Dummy',
    imageUrl: nftDummy2,
    imageAlt: 'house-dummy',
    assetValue: 150000,
    equityOwned: 800000,
    interestRate: 0.04,
    paymentRate: 0.2,
    prepaidFunds: 100000,
};

const tempLoanItems3 = {

    address: '0x7232ff16985a3b5bcd96b490461f7703b5d9d137',

    name: 'Metaverse Property Dummy',
    imageUrl: nftDummy3,
    imageAlt:
        'metaverse-dummy',
    assetValue: 500,
    equityOwned: 20000,
    interestRate: 0.04,
    paymentRate: 0.03,
    prepaidFunds: 100,
};

/*
const escrowContractAddrs = [
    '0x9f83eaaa2046fcc139aaa0e786475a843056d5a8',
    '0x7232ff16985a3b5bcd96b490461f7703b5d9d136'
];
 */

const LoanList = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [loanItems, setLoanItems] = useState<any>([]);

    const [activeLoanItem, setActiveLoanItem] = useState<any>();

    useEffect(() => {
        if (activeLoanItem != null) {
            onOpen();
        }
    }, [activeLoanItem, onOpen]);

    useEffect(() => {
        // TODO: fetch events to get list of escrows

        setLoanItems([tempLoanItems1, tempLoanItems2, tempLoanItems3]);
    }, []);

    const closeModal = useCallback(() => {
        setActiveLoanItem(null);
        onClose();
    }, [setActiveLoanItem, onClose]);

    return (
        <Flex mt={8}>
            {loanItems.map((loanItem: any) => <LoanCard key={loanItem.address} loanItem={loanItem} setActiveLoanItem={setActiveLoanItem} />)}

            <ModalLoanPay isOpen={isOpen} closeModal={closeModal} loanItem={activeLoanItem} />
        </Flex>
    );
};

export default LoanList;
