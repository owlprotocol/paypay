// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol';

contract TransferableEscrow is ERC721Holder {
    // Assets
    address _paymentToken;
    address _assetNFT;
    address _borrowerNFT;
    address _lenderNFT;
    uint256 _assetTokenId;
    uint256 _borrowerTokenId;
    uint256 _lenderTokenId;

    // Timings
    uint256 _loanStart;
    uint256 _loanEnd;

    // Payments
    uint256 _weiPaid;
    uint256 _weiPerSecond;

    /***********
     Constructor
     **********/

    constructor(
        address paymentToken,
        address assetNFT,
        address borrowerNFT,
        address lenderNFT,
        uint256 assetTokenId,
        uint256 borrowerTokenId,
        uint256 lenderTokenId,
        uint256 loanStart,
        uint256 loanEnd,
        uint256 weiAssetWorth
    ) {
        _paymentToken = paymentToken;
        _assetNFT = assetNFT;
        _borrowerNFT = borrowerNFT;
        _lenderNFT = lenderNFT;
        _assetTokenId = assetTokenId;
        _borrowerTokenId = borrowerTokenId;
        _lenderTokenId = lenderTokenId;
        _loanStart = loanStart;
        _loanEnd = loanEnd;

        // Calculate weiPerSecond
        _weiPerSecond = weiAssetWorth / (loanEnd - loanStart);
        require(_weiPerSecond > 0, 'weiAssetWorth !> timespan');
    }

    /**********************
     Calculate Amount Owed
     *********************/

    function totalOwedAtTime(uint256 _time) public view returns (uint256) {
        // Loan not started
        if (_time < _loanStart) return 0;

        // Loan ended, calculate based on loan end time
        if (_time > _loanEnd) _time = _loanEnd;

        return (_time - _loanStart) * _weiPerSecond;
    }

    function totalOwedNow() public view returns (uint256) {
        return totalOwedAtTime(block.timestamp);
    }

    function totalOwedAtEnd() public view returns (uint256) {
        return totalOwedAtTime(_loanEnd);
    }

    /************************
     Calculate Payment Status
     ***********************/

    function hasDefaulted() public view returns (bool) {
        return _weiPaid < totalOwedNow();
    }

    function paymentsComplete() public view returns (bool) {
        return _weiPaid >= totalOwedAtEnd();
    }

    /*********************
     Lender/Buyer Getters
     ********************/

    function getLender() public view returns (address) {
        return IERC721(_lenderNFT).ownerOf(_lenderTokenId);
    }

    function getBorrower() public view returns (address) {
        return IERC721(_borrowerNFT).ownerOf(_borrowerTokenId);
    }

    /*****************
     Payment Handlers
     ****************/

    function makePayment(uint256 amount) public {
        require(amount <= totalOwedAtEnd() - _weiPaid, 'Payment over limit!');
        SafeERC20.safeTransferFrom(IERC20(_paymentToken), getBorrower(), address(this), amount);
        // Increase paid
        _weiPaid += amount;
    }

    function withdrawPayment() public {
        // Transfer all balance out
        SafeERC20.safeTransfer(IERC20(_paymentToken), getLender(), IERC20(_paymentToken).balanceOf(address(this)));
    }

    /**********
     Claimable
     *********/

    function claimAssetNFT() public {
        // transferTo
        address transferTo;
        if (hasDefaulted() == true) transferTo = getBorrower();
        else if (paymentsComplete() == true) transferTo = getLender();
        else revert('NFT not claimable!');

        // Transfer out
        IERC721(_assetNFT).safeTransferFrom(address(this), transferTo, _assetTokenId);
    }
}
