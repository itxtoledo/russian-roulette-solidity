// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract RussianRoulette {
    uint256 constant ENTRY_PRICE = 0.1 ether;

    uint256 public room;
    address[] private players;

    event PlayerJoined(address indexed player, uint256 indexed room);
    event Victim(address indexed victim, uint256 indexed room);

    function enter() external payable {
        require(players.length < 6);
        require(msg.value == ENTRY_PRICE);

        players.push(msg.sender);

        emit PlayerJoined(msg.sender, room);

        if (players.length == 6) {
            executeRoom();
        }
    }

    function executeRoom() private {
        require(players.length == 6);

        uint256 deadSeat = random();

        distributeFunds(deadSeat);

        room = room + 1;

        players = new address[](0);
    }

    function distributeFunds(uint256 victimSeat_) private {
        uint256 balanceToDistribute = SafeMath.div(address(this).balance, 5);

        address victim = players[victimSeat_];
        address[] memory winners = new address[](5);
        uint256 j = 0;
        for (uint i = 0; i < 6; i++) {
            if (i != victimSeat_) {
                payable(players[i]).transfer(balanceToDistribute);
                winners[j] = players[i];
                j++;
            }
        }

        emit Victim(victim, room);
    }

    function random() private view returns (uint256) {
        return
            uint256(
                uint256(
                    keccak256(
                        abi.encodePacked(
                            block.number,
                            block.timestamp,
                            block.difficulty,
                            room
                        )
                    )
                ) % 6
            );
    }
}
