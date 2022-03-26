//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract GameItem is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("Adachi Tokens", "ADANFT") {}

    mapping(address => uint256) public lastPlayedAt;

    mapping(uint256 => NFTItem) private _idToItem;

    mapping(uint256 => uint256) public stageToCount;

    struct NFTItem {
        uint256 tokenId;
        address owner;
        uint256 stage;
        uint256 number;
        string message;
    }

    event CreateNFTItem(
        uint256 tokenId,
        uint256 stage,
        uint256 number,
        string message
    );
    event DebugLogEvent(string);

    function createGameItem(
        uint256 _stage,
        string memory _message,
        string memory _svg
    ) public payable {
        require(_ownedNFTOfStage(_stage));
        uint256 newItemId = _tokenIds.current();
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "Adachi", "message":',
                        _message,
                        '"A highly acclaimed collection of squares.", "image": "data:image/_svg+xml;base64,',
                        Base64.encode(bytes(_svg)),
                        '"}'
                    )
                )
            )
        );
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        _safeMint(msg.sender, newItemId);
        _setTokenURI(newItemId, finalTokenUri);
        uint256 number = stageToCount[_stage] + 1;
        _idToItem[newItemId] = NFTItem(
            newItemId,
            msg.sender,
            _stage,
            number,
            _message
        );
        stageToCount[_stage]++;
        emit CreateNFTItem(newItemId, _stage, number, _message);
        _tokenIds.increment();
    }

    function canPlayGame() public view returns (bool) {
        return lastPlayedAt[msg.sender] + 12 hours < block.timestamp;
    }

    function startGame() public payable {
        require(canPlayGame());
        lastPlayedAt[msg.sender] = block.timestamp;
    }

    // 計算方法の変更
    function _judge(uint256 _number) private view returns (bool) {
        uint256 firstNumber = uint256(
            keccak256(
                abi.encodePacked(
                    block.timestamp,
                    block.difficulty,
                    msg.sender,
                    _number
                )
            )
        );
        uint256 transactionCount = uint256(_tokenIds.current());
        uint256 transactionNumber = firstNumber % (transactionCount + 1);
        uint256 addressNumber = firstNumber % 10;
        uint256 totalCount = 1;

        for (uint256 i = 0; i < transactionCount; i++) {
            NFTItem memory item = _idToItem[transactionNumber];
            uint256 ownerAddressNum = uint256(uint160(address(item.owner)));
            for (uint256 i = 0; i < addressNumber + 1; i++) {
                ownerAddressNum = uint256(
                    keccak256(
                        abi.encodePacked(
                            ownerAddressNum,
                            ((i + 1) * addressNumber)
                        )
                    )
                );
            }
            totalCount = uint256(
                keccak256(abi.encodePacked(ownerAddressNum, transactionNumber))
            );
            transactionNumber = ownerAddressNum % (transactionCount + 1);
            addressNumber = ownerAddressNum % 10;
        }
        if (totalCount == 0) {
            return true;
        } else {
            return false;
        }
    }

    function judgeGame(uint256 _stage, uint256 _number)
        public
        view
        returns (uint256)
    {
        if (_judge(_number)) {
            uint256 result = _canMint(_stage);
            return result;
        } else {
            return 3;
        }
    }

    function fetchCurrenStatus() public view returns (uint256[] memory) {
        uint256[] memory countList = new uint256[](5);
        for (uint256 i = 1; i < 6; i++) {
            countList[i - 1] = stageToCount[i];
        }
        return countList;
    }

    /*
        0→次のステージに移動
        1→ユーザがNFTを発行するかゲームを継続できるか選択できる
        2→NFTを発行させる
    */
    function _canMint(uint256 _stage) private view returns (uint256) {
        if (_ownedNFTOfStage(_stage)) {
            return 0;
        } else {
            if (_isExistedNFTOfStage(_stage)) {
                return 1;
            } else {
                return 2;
            }
        }
    }

    function _isExistedNFTOfStage(uint256 _stage) private view returns (bool) {
        if (stageToCount[_stage] != 0) {
            return true;
        } else {
            return false;
        }
    }

    function _ownedNFTOfStage(uint256 _stage) private view returns (bool) {
        NFTItem[] memory items = fetchMyNFTs();
        for (uint256 i = 0; i < items.length; i++) {
            if (items[i].stage == _stage) {
                return true;
            }
        }
        return false;
    }

    function fetchMyNFTs() public view returns (NFTItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (_idToItem[i].owner == msg.sender) {
                itemCount += 1;
            }
        }

        NFTItem[] memory items = new NFTItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (_idToItem[i].owner == msg.sender) {
                NFTItem storage currentItem = _idToItem[i];
                items[currentIndex] = currentItem;
                currentIndex++;
            }
        }

        return items;
    }
}
