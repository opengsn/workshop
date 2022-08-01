const CaptureTheFlag = artifacts.require('CaptureTheFlag')
const WhitelistPaymaster = artifacts.require('WhitelistPaymaster')

module.exports = async function (deployer, network, accounts) {
    const forwarder = require('../build/gsn/Forwarder').address
    await deployer.deploy(CaptureTheFlag, forwarder)

    console.log(`Deployed CTF at ${CaptureTheFlag.address} with forwarder ${forwarder}`)

    await deployer.deploy(WhitelistPaymaster)
    const relayHubAddress = require('../build/gsn/RelayHub.json').address
    const paymaster = await WhitelistPaymaster.deployed()
    await paymaster.setRelayHub(relayHubAddress)
    await paymaster.setTrustedForwarder(forwarder)

    // This is the first ganache address, when started with "ganache-cli -d"
    // you can add your metamask address here.
    await paymaster.whitelistSender('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1')


    // you can also add addresses by running `truffle console` and then running:
    // const pm = await WhitelistPaymaster.deployed()
    // pm.whitelistSender('0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1')

    await web3.eth.sendTransaction({from: accounts[0], to: paymaster.address, value: 1e18})
    console.log(`1 ETH deposited to Paymaster(${WhitelistPaymaster.address})`)
}
