import React, {useState, useEffect, useCallback} from 'react'

import styled from 'styled-components';
import { SimpleGrid, Box, Image, AspectRatio, Badge } from '@chakra-ui/react';
import moment from 'moment';
import numeral from 'numeral';

const LoanAttrBox = styled(Box)`
    > h5 {
        font-size: 12px;
        font-weight: bold;
        color: #777;
    }

    font-size: 18px;
`;

const LoanCard = (loanItem: any) => {
    return (
        <Box
            key={loanItem}
            mx={4}
            w="326px"
            boxShadow="lg"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
        >
            <AspectRatio maxH="200px" ratio={4 / 3}>
                <Image src={loanItem.imageUrl} alt={loanItem.imageAlt} />
            </AspectRatio>

            <Box p="6">
                <Box
                    color="#404040"
                    fontWeight="bold"
                    letterSpacing="wide"
                    fontSize="18"
                    mb={3}
                >
                    {loanItem.name}
                </Box>

                <SimpleGrid columns={2} spacing={4}>
                    <LoanAttrBox>
                        <h5>Equity Owned:</h5>
                        <span>{numeral(loanItem.equityOwned).format('0,0')}</span>
                    </LoanAttrBox>
                    <LoanAttrBox>
                        <h5>Asset Value:</h5>
                        <span>{numeral(loanItem.assetValue).format('0,0')}</span>
                    </LoanAttrBox>
                    <LoanAttrBox>
                        <h5>Interest rate:</h5>
                        <span>{numeral(loanItem.interestRate).format('0%')}</span>
                    </LoanAttrBox>
                    <LoanAttrBox>
                        <h5>Payment Rate:</h5>
                        <span>{numeral(loanItem.paymentRate).format('0%')}</span>
                    </LoanAttrBox>
                </SimpleGrid>
            </Box>
        </Box>
    );
};

function calcTimeToDefault(tempLoanItem: any) {
    // add time param

    const secondsLeft = tempLoanItem.prepaidFunds / tempLoanItem.paymentRate;

    return moment.utc(secondsLeft * 1000).format('HH:mm:ss');
}

export default LoanCard;
