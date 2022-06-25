import React, { useState, useEffect } from 'react';
import { LoanCard } from '../../components';
import { Flex } from '@chakra-ui/react';

import nftDummy1 from '../../assets/nft-dummy-1.jpeg';
import nftDummy2 from '../../assets/nft-dummy-2.png';
import nftDummy3 from '../../assets/nft-dummy-3.jpeg';

const tempLoanItems1 = {
    name: 'Bored Ape Dummy',
    imageUrl: nftDummy1,
    imageAlt: 'bored-ape-dummy',
    assetValue: 50000,
    equityOwned: 300000,
    interestRate: 0.04,
    paymentRate: 0.08,
    prepaidFunds: 120000,
};

const tempLoanItems2 = {
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
    name: 'Metaverse Property Dummy',
    imageUrl: nftDummy3,
    imageAlt: 'metaverse-dummy',
    assetValue: 500,
    equityOwned: 20000,
    interestRate: 0.04,
    paymentRate: 0.03,
    prepaidFunds: 100,
};

const LoanList = () => {
    const [loanItems, setLoanItems] = useState<any>([]);

    useEffect(() => {
        setLoanItems([tempLoanItems1, tempLoanItems2, tempLoanItems3]);
    }, []);

    return (
        <Flex mt={8}>
            {loanItems.length === 0 ? <div>Loading</div> :
                loanItems.map((loanItem: any) => LoanCard(loanItem))
            }
        </Flex>
    );
};

export default LoanList;
