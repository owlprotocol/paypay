import React, { useState, useEffect} from 'react';
import styled from 'styled-components';
import { Grid, GridItem, Box, Image, AspectRatio, Button, Badge } from '@chakra-ui/react'; //Badge
import { useContract, useProvider } from 'wagmi';
import escrowContractJSON from '../../contractABIs/TransferableEscrowV2.json';
import moment from 'moment';
import { BigNumber, ethers } from 'ethers';
import numeral from 'numeral';

const LoanAttrBox = styled(GridItem)`
    > h5 {
        font-size: 12px;
        color: #777;
    }

    font-weight: bold;
    font-size: 18px;
`;

const dateFormat = 'MMM D, YYYY';

type FinalData = {
    paymentInfo: {
        address: string;
        loanStartDate: string;
        loanEndDate: string;
        weiPaid: BigNumber;
        ethPaid: number;
        weiPerSecondPrincipal: number;
        weiPerSecondInterest: number;
    },
    totalPrincipal: number;
    totalOwedNow: number;
    totalOwedAtEnd: number;
    interestRateNow: number;
    prepaidFunds: number;
    weiPerSecond: number;
    isDefaulted: boolean;
};

const LoanCard = ({ loanItem, setActiveLoanItem }: any) => {

    const provider = useProvider();

    const escrowContract = useContract({
        addressOrName: loanItem.address,
        contractInterface: escrowContractJSON.abi,
        signerOrProvider: provider,
    });

    const finalLoanItem: FinalData = {
        paymentInfo: {
            address: '',
            loanStartDate: '',
            loanEndDate: '',
            weiPaid: BigNumber.from(0),
            ethPaid: 0,
            weiPerSecondPrincipal: 0,
            weiPerSecondInterest: 0
        },
        totalPrincipal: 0,
        totalOwedNow: 0,
        totalOwedAtEnd: 0,
        interestRateNow: 0,
        prepaidFunds: 0,
        weiPerSecond: 0,
        isDefaulted: false,
    };

    const [finalData, setFinalData] = useState<FinalData>();

    useEffect(() => {
        (async () => {
            try {
                const paymentInfo = await escrowContract.paymentInfo();

                finalLoanItem.paymentInfo = {
                    address: loanItem.address,
                    loanStartDate: moment(paymentInfo.loanStart.toNumber() * 1000).format(dateFormat),
                    loanEndDate: moment(paymentInfo.loanEnd.toNumber() * 1000).format(dateFormat),
                    weiPaid: paymentInfo.weiPaid,
                    ethPaid: parseFloat(ethers.utils.formatEther(paymentInfo.weiPaid)),
                    weiPerSecondPrincipal: paymentInfo.weiPerSecondPrinciple,
                    weiPerSecondInterest: paymentInfo.weiPerSecondInterest,
                };

                finalLoanItem.totalPrincipal = parseFloat(ethers.utils.formatEther(await escrowContract.totalPrincipal()));
                finalLoanItem.totalOwedNow = parseFloat(ethers.utils.formatEther(await escrowContract.totalPrincipal()));
                finalLoanItem.totalOwedAtEnd = parseFloat(ethers.utils.formatEther(await escrowContract.totalOwedAtEnd()));
                finalLoanItem.weiPerSecond = parseFloat(ethers.utils.formatEther((paymentInfo.weiPerSecondPrinciple as BigNumber).add(
                    paymentInfo.weiPerSecondInterest as BigNumber,
                )));

                finalLoanItem.isDefaulted = await escrowContract.hasDefaulted();

                finalLoanItem.interestRateNow = (finalLoanItem.totalOwedAtEnd / finalLoanItem.totalPrincipal) - 1;

                finalLoanItem.prepaidFunds = BigNumber.from(finalLoanItem.paymentInfo.weiPaid).eq(0) ?
                    0 : parseFloat(ethers.utils.formatEther(
                        BigNumber.from(finalLoanItem.paymentInfo.weiPaid)
                            .sub(finalLoanItem.totalOwedNow)
                    ));

                console.log(finalLoanItem);

                setFinalData(finalLoanItem);

            } catch (err) {
                console.error(`${loanItem.address} contract not found`, err);
            }
        })();
    }, [escrowContract]);

    return (
        finalData == null ? <div>Loading</div> :
        <Box key={loanItem.name} mx={4} w="326px" boxShadow="lg" borderWidth="1px" borderRadius="lg" overflow="hidden">
            <AspectRatio maxH="200px" ratio={4 / 3}>
                <Image src={loanItem.imageUrl} alt={loanItem.imageAlt} />
            </AspectRatio>

            <Box p="6">
                <Box color="#404040" fontWeight="bold" letterSpacing="wide" fontSize="18" mb={4}>
                    {loanItem.name}
                    {finalData.isDefaulted ? <Badge colorScheme="red" ml={3}>DEFAULTED</Badge> : ''}
                </Box>

                <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                    <LoanAttrBox>
                        <h5>Equity Owned:</h5>
                        <span>{numeral(finalData.paymentInfo.ethPaid).format('0,0.000')} ETH</span>
                    </LoanAttrBox>
                    <LoanAttrBox>
                        <h5>Asset Value:</h5>
                        <span>{numeral(finalData.totalPrincipal).format('0,0.000')} ETH</span>
                    </LoanAttrBox>
                    <LoanAttrBox>
                        <h5>Interest rate:</h5>
                        <span>{numeral(finalData.interestRateNow).format('0.000%')}</span>
                    </LoanAttrBox>
                    <LoanAttrBox colSpan={2}>
                        <h5>Payment Rate:</h5>
                        <span style={{ fontSize: 14 }}>{numeral(finalData.weiPerSecond).format('0,0.00000000000')} Wei / Second</span>
                    </LoanAttrBox>
                    <LoanAttrBox>
                        <h5>Prepaid Funds:</h5>
                        <span>{numeral(finalData.prepaidFunds).format('$0,0')}</span>
                    </LoanAttrBox>
                    <LoanAttrBox>
                        <h5>Time to Default:</h5>
                        <span style={{fontSize: 14}}>
                            {finalData.isDefaulted ? <Badge colorScheme="red">in default</Badge> : calcTimeToDefault(finalData)}
                        </span>
                    </LoanAttrBox>
                    <LoanAttrBox>
                        <h5>Start Date:</h5>
                        <span style={{ fontSize: 14 }}>{finalData.paymentInfo.loanStartDate}</span>
                    </LoanAttrBox>
                    <LoanAttrBox>
                        <h5>Maturity Date:</h5>
                        <span style={{ fontSize: 14 }}>{finalData.paymentInfo.loanEndDate}</span>
                    </LoanAttrBox>
                    <Button onClick={() => setActiveLoanItem(loanItem)}>Add Funds</Button>
                    <Button variant="secondary">List for Sale</Button>
                </Grid>
            </Box>
        </Box>
    );
};

function calcTimeToDefault(tempLoanItem: any) {
    const secondsLeft = tempLoanItem.prepaidFunds / tempLoanItem.paymentRate;

    /*
    let timeLeftFormat: string;

    if (secondsLeft > 60 * 60 * 24) {
        timeLeftFormat = 'd [days] h [hours]';
    } else if (secondsLeft > 60 * 60) {
        timeLeftFormat = 'h [hours] m [minutes]';
    } else {
        timeLeftFormat = 'm [minutes] s [seconds]';
    }
    */

    return moment(Date.now() + secondsLeft * 1000).fromNow();
}

export default LoanCard;
