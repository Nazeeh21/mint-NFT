//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import "hardhat/console.sol";

contract NazeehNFT is ERC721URIStorage {

  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  constructor() ERC721("SquareNFT", "SQUARE") {
    console.log("this is my contract");
  }

  function makeAnEpicNFT() public {
    console.log("About to make an epic NFT");
    
    // Get NFT ID
    uint256 newItemId = _tokenIds.current();

    // Mint NFT
    _safeMint(msg.sender, newItemId);

    // Set NFT Data
    _setTokenURI(newItemId, "https://jsonkeeper.com/b/IJ50");

    // Increment NFT ID for next person
    _tokenIds.increment();

    console.log("minted an epic NFT with id %s to %s", newItemId, msg.sender);
  }
}