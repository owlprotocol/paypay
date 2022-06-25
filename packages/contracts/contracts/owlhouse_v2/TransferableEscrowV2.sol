// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC20/IERC20.sol';
import '@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol';

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';
import '@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol';

contract TransferableEscrowV2 is ERC721Holder {
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
    uint256 _weiPerSecondPrinciple;
    uint256 _weiPerSecondInterest;

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
        uint256 weiAssetWorth,
        uint256 weiAssetWorthInterest
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
        _weiPerSecondPrinciple = weiAssetWorth / (loanEnd - loanStart);
        require(_weiPerSecondPrinciple > 0, 'weiAssetWorth !> timespan');

        // Calculate interest
        if (weiAssetWorthInterest != 0) {
            _weiPerSecondInterest = weiAssetWorthInterest / (loanEnd - loanStart);
            require(_weiPerSecondInterest > 0, 'weiPerSecondInterest !> timespan');
        }
    }

    /**********************
     Calculate Amount Owed
     *********************/

    function totalOwedAtTime(uint256 _time) public view returns (uint256) {
        return totalInterestOwedAtTime(_time) + totalPrincipalOwedAtTime(_time);
    }

    function totalPayableNow() public view returns (uint256) {
        return (totalInterestOwedAtTime(block.timestamp) + totalPrincipal()) - _weiPaid;
    }

    function totalOwedNow() public view returns (uint256) {
        return totalOwedAtTime(block.timestamp);
    }

    function totalOwedAtEnd() public view returns (uint256) {
        return totalOwedAtTime(_loanEnd);
    }

    function totalPrincipal() public view returns (uint256) {
        return totalPrincipalOwedAtTime(_loanEnd);
    }

    function totalInterestOwedAtTime(uint256 _time) public view returns (uint256) {
        // Loan not started
        if (_time < _loanStart) return 0;

        // Loan ended, calculate based on loan end time
        if (_time > _loanEnd) _time = _loanEnd;

        // Time to now
        uint256 loanRuntime = _time - _loanStart;

        return loanRuntime * _weiPerSecondInterest;
    }

    function totalPrincipalOwedAtTime(uint256 _time) public view returns (uint256) {
        // Loan not started
        if (_time < _loanStart) return 0;

        // Loan ended, calculate based on loan end time
        if (_time > _loanEnd) _time = _loanEnd;

        // Time to now
        uint256 loanRuntime = _time - _loanStart;

        return loanRuntime * _weiPerSecondPrinciple;
    }

    /************************
     Calculate Payment Status
     ***********************/

    function hasDefaulted() public view returns (bool) {
        return _weiPaid < totalOwedNow();
    }

    function paymentsComplete(uint256 time) public view returns (bool) {
        return _weiPaid >= totalOwedAtTime(time) + totalPrincipal();
    }

    function paymentInfo()
        public
        view
        returns (
            uint256 loanStart,
            uint256 loanEnd,
            uint256 weiPaid,
            uint256 weiPerSecondPrinciple,
            uint256 weiPerSecondInterest,
            bool paymentsCompleted
        )
    {
        return (
            _loanStart,
            _loanEnd,
            _weiPaid,
            _weiPerSecondPrinciple,
            _weiPerSecondInterest,
            paymentsComplete(block.timestamp)
        );
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
        // Check if a user is paying off completely
        if (amount > totalPayableNow())
            // Bump down to stop from overpaying
            amount = totalPayableNow();

        SafeERC20.safeTransferFrom(IERC20(_paymentToken), getBorrower(), address(this), amount);
        // Increase paid
        _weiPaid += amount;
        // Check if claimable
        if (paymentsComplete(block.timestamp) == true) claimAssetNFT();
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
        else if (paymentsComplete(block.timestamp) == true) transferTo = getLender();
        else revert('NFT not claimable!');

        // Transfer out
        IERC721(_assetNFT).safeTransferFrom(address(this), transferTo, _assetTokenId);
    }
}
