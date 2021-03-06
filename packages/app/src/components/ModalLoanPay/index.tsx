import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
} from '@chakra-ui/react';

const ModalLoanPay = ({ isOpen, closeModal, loanItem}: any) => {

    return (
        <Modal
            isOpen={isOpen}
            onClose={closeModal}
        >
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>
                    {loanItem != null ? loanItem.name : ''}
                </ModalHeader>
                <ModalCloseButton/>
                <ModalBody>
                    {loanItem != null ? loanItem.address : ''}
                    <br/>
                    <br/>
                    TODO
                </ModalBody>
                <ModalFooter>
                    <Button onClick={closeModal} mr={3}>
                        Close
                    </Button>
                    <Button variant="secondary">
                        Secondary
                        Action
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ModalLoanPay;
