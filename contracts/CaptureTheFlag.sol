/**
 * SPDX-License-Identifier:MIT
 */
pragma solidity ^0.8.7;

contract CaptureTheFlag {

    event FlagCaptured(address previousHolder, address currentHolder);

    address public currentHolder = address(0);

    function captureTheFlag() external {
        address previousHolder = currentHolder;

        currentHolder = msg.sender;

        emit FlagCaptured(previousHolder, currentHolder);
    }
}
