// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import '@openzeppelin/contracts/token/ERC721/IERC721.sol';

interface IOwlNFTV2 is IERC721 {
    function safeMint(
        address to,
        uint256 tokenId,
        string memory uri
    ) external;

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) external;

    function tokenURI(uint256 tokenId) external;
}
