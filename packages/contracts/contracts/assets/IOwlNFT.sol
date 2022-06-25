// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

interface IOwlNFT is IERC721 {
    function safeMint(address to, uint256 tokenId) external;

    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}
