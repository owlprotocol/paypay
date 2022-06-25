// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

interface ITransferableEscrow {
    /**********************
     Calculate Amount Owed
     *********************/

    function totalOwedAtTime(uint256 _time) external view returns (uint256);

    function totalOwedNow() external view returns (uint256);

    function totalOwedAtEnd() external view returns (uint256);

    /************************
     Calculate Payment Status
     ***********************/

    function hasDefaulted() external view returns (bool);

    function paymentsComplete() external view returns (bool);

    /*********************
     Lender/Buyer Getters
     ********************/

    function getLender() external view returns (address);

    function getBorrower() external view returns (address);

    /*****************
     Payment Handlers
     ****************/

    function makePayment(uint256 amount) external;

    function withdrawPayment() external;

    /**********
     Claimable
     *********/

    function claimAssetNFT() external;
}
