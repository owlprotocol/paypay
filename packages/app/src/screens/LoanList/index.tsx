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
    name: 'Bored Ape Dummy',
    imageUrl: nftDummy1,
    imageAlt: 'bored-ape-dummy',
};

const tempLoanItems2 = {
    name: 'House Dummy',
    imageUrl: nftDummy2,
    imageAlt: 'house-dummy',
};

const tempLoanItems3 = {
    name: 'Metaverse Property Dummy',
    imageUrl: nftDummy3,
    imageAlt: 'metaverse-dummy',
};

const dummyData = [tempLoanItems1, tempLoanItems2, tempLoanItems3];

const LoanList = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [loanItems, setLoanItems] = useState<any>();

    const [activeLoanItem, setActiveLoanItem] = useState<any>();

    useEffect(() => {
        if (activeLoanItem != null) {
            onOpen();
        }
    }, [activeLoanItem, onOpen]);

    useEffect(() => {
        (async () => {
            const res = await fetch('https://api.thegraph.com/subgraphs/name/emilianobonassi/paypay-rinkeby', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: '{\n  escrows(first: 5) {\n    id\n    lenderAddress\n    paymentToken\n    escrowAddress\n  }\n}\n',
                    variables: null,
                }),
            });

            const resJSON = await res.json()

            setLoanItems(resJSON.data.escrows.map((escrowData: any) => {

                const randomDummy = dummyData[Math.floor(Math.random() * 3)]

                return {
                    address: escrowData.id,
                    ...randomDummy
                };
            }))
        })();
    }, []);

    const closeModal = useCallback(() => {
        setActiveLoanItem(null);
        onClose();
    }, [setActiveLoanItem, onClose]);

    return (
        <Flex mt={8}>
            {loanItems == null ? <div>Loading</div> : (
                loanItems.length === 0 ? <div>No Items Found</div> :
                loanItems.map((loanItem: any) => <LoanCard key={loanItem.address} loanItem={loanItem} setActiveLoanItem={setActiveLoanItem} />
            ))}

            <ModalLoanPay isOpen={isOpen} closeModal={closeModal} loanItem={activeLoanItem} />
        </Flex>
    );
};

export default LoanList;
