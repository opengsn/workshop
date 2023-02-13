/**
 * SPDX-License-Identifier:MIT
 */
pragma solidity ^0.8.7;

import "@opengsn/contracts/src/ERC2771Recipient.sol";

contract CaptureTheFlag is ERC2771Recipient {

    event FlagCaptured(address previousHolder, address currentHolder);

    address public currentHolder = address(0);

    constructor(address forwarder) {
        _setTrustedForwarder(forwarder);
    }

    string public versionRecipient = "3.0.0";

    function captureTheFlag() external {
        address previousHolder = currentHolder;

        currentHolder = _msgSender();

        emit FlagCaptured(previousHolder, currentHolder);
    }
}
