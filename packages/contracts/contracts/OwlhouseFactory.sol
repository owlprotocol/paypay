import './OwlNFT.sol';
import './IOwlNFT.sol';
import './TransferableEscrow.sol';
import './ITransferableEscrow.sol';

import '@openzeppelin/contracts/utils/Counters.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

contract OwlhouseFactory {
    using Counters for Counters.Counter;

    Counters.Counter private _mintCounter;

    address _borrowerNFT;
    address _lenderNFT;

    event TransferEscrow(
        address lenderAddress,
        address paymentToken,
        uint256 loanStart,
        uint256 loanEnd,
        uint256 weiNetWorth
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
        uint256 weiAssetWorth
    ) public returns (address) {
        // Token Minting
        uint256 tokenId = _mintCounter.current();

        IOwlNFT(_lenderNFT).safeMint(lenderAddress, tokenId);
        IOwlNFT(_borrowerNFT).safeMint(borrowerAddress, tokenId);

        // Setup Escrow Contract
        address escrow = address(
            new TransferableEscrow(
                paymentToken,
                assetNFT,
                _borrowerNFT,
                _lenderNFT,
                assetTokenId,
                tokenId, // borrower token id
                tokenId, // lender token id
                loanStart,
                loanEnd,
                weiAssetWorth
            )
        );

        // Transfer NFT
        IERC721(assetNFT).safeTransferFrom(lenderAddress, escrow, assetTokenId);

        emit TransferEscrow(lenderAddress, paymentToken, loanStart, loanEnd, weiAssetWorth);

        // Increment Token Counter
        _mintCounter.increment();

        return escrow;
    }
}
