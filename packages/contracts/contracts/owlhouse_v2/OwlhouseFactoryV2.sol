// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '../assets/OwlNFT.sol';
import '../assets/IOwlNFT.sol';
import './TransferableEscrowV2.sol';

import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

contract OwlhouseFactoryV2 {
    using Counters for Counters.Counter;

    Counters.Counter private _mintCounter;

    address _borrowerNFT;
    address _lenderNFT;

    event TransferEscrow(
        address lenderAddress,
        address paymentToken,
        address escrowAddress,
        uint256 loanStart,
        uint256 loanEnd,
        uint256 weiNetWorth,
        uint256 weiAssetWorthInterest
    );

    constructor() {
        // Fancy permissions to be added later
        _borrowerNFT = address(new OwlNFT('BorrowerToken', 'BRWR', 'IPFS-HASH'));
        _lenderNFT = address(new OwlNFT('LenderToken', 'LNDR', 'IPFS-HASH'));
    }

    function deployEscrow(
        // Account details
        address lenderAddress,
        address borrowerAddress,
        // Payment Details
        address assetNFT,
        address paymentToken,
        uint256 assetTokenId,
        uint256 loanStart,
        uint256 loanEnd,
        uint256 weiAssetWorth,
        uint256 weiAssetWorthInterest
    ) public returns (address) {
        // Token Minting
        uint256 tokenId = _mintCounter.current();

        IOwlNFT(_lenderNFT).safeMint(lenderAddress, tokenId);
        IOwlNFT(_borrowerNFT).safeMint(borrowerAddress, tokenId);

        // Setup Escrow Contract
        address escrow = address(
            new TransferableEscrowV2(
                paymentToken,
                assetNFT,
                _borrowerNFT,
                _lenderNFT,
                assetTokenId,
                tokenId, // borrower token id
                tokenId, // lender token id
                loanStart,
                loanEnd,
                weiAssetWorth,
                weiAssetWorthInterest
            )
        );

        // Transfer NFT
        IERC721(assetNFT).safeTransferFrom(lenderAddress, escrow, assetTokenId);

        emit TransferEscrow(
            lenderAddress,
            paymentToken,
            escrow,
            loanStart,
            loanEnd,
            weiAssetWorth,
            weiAssetWorthInterest
        );

        // Increment Token Counter
        _mintCounter.increment();

        return escrow;
    }
}
