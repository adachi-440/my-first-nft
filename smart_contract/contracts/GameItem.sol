//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract GameItem is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Adachi Tokens", "ADANFT") {}

    // mapping(uint256 => NFTItem) private stageToNFTItem;

    struct NFTItem {
        uint256 tokenId;
        uint256 number;
        uint256 stage;
        bool sold;
    }

    NFTItem[] items;

    function createGameItem() public payable onlyOwner returns (uint256) {
        uint256 newItemId = _tokenIds.current();
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Adachi", "description": "A highly acclaimed collection of squares.", "image": "data:image/png;base64,PHN2ZyB3aWR0aD0iMzJweCIgaGVpZ2h0PSIzMnB4IiB2aWV3Qm94PSIwIDAgMzIgMzIiIGlkPSJpY29uIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxkZWZzPgogICAgPHN0eWxlPgogICAgICAuY2xzLTEgewogICAgICAgIGZpbGw6IG5vbmU7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgPC9kZWZzPgogIDxwYXRoIGQ9Ik0xMiwyMkg0VjhIMTZWNkg0QTIsMiwwLDAsMCwyLDhWMjJhMiwyLDAsMCwwLDIsMmg4WiIvPgogIDxwb2x5Z29uIHBvaW50cz0iMjIgMTMuNDE0IDI4IDcuNDE0IDI4IDEyIDMwIDEyIDMwIDQgMjIgNCAyMiA2IDI2LjU4NiA2IDIwLjU4NiAxMiAyMiAxMy40MTQiLz4KICA8cGF0aCBkPSJNMTMuNDk1MywzMGwtMS42LTEuMkwxNywyMmg3VjE2aDJ2NmEyLjAwMjMsMi4wMDIzLDAsMCwxLTIsMkgxOFoiLz4KICA8cmVjdCBpZD0iX1RyYW5zcGFyZW50X1JlY3RhbmdsZV8iIGRhdGEtbmFtZT0iJmx0O1RyYW5zcGFyZW50IFJlY3RhbmdsZSZndDsiIGNsYXNzPSJjbHMtMSIgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIi8+Cjwvc3ZnPgo="}'
                    )
                )
            )
        );
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        console.log("Before mint");
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, finalTokenUri);
        items.push(NFTItem(newItemId, 1, 1, false));
        _tokenIds.increment();
        return newItemId;
    }

    function transferItem() public onlyOwner {
        transferToken(
            "0x221E25Ad7373Fbaf33C7078B8666816586222A09",
            msg.sender,
            ""
        );
    }

    function fetchNFTs() public view returns (NFTItem[] memory) {
        // NFTItem[] list;
        // for (uint256 index = 0; index < items.length; index++) {
        //     if (items.stage == stage) {
        //         list.push(item[index]);
        //     }
        // }
        return items;
    }
}
