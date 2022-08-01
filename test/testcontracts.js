const {RelayProvider} = require('@opengsn/provider')
const {GsnTestEnvironment} = require('@opengsn/dev')

const CaptureTheFlag = artifacts.require('CaptureTheFlag')
const WhitelistPaymaster = artifacts.require('WhitelistPaymaster')

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

contract("CaptureTheFlag", async accounts => {

    let account
    let captureFlagContract
    let whitelistPaymaster

    before(async () => {
        const {forwarderAddress, relayHubAddress} = GsnTestEnvironment.loadDeployment()

        const whitelistPaymaster = await WhitelistPaymaster.new()
        await whitelistPaymaster.setTrustedForwarder(forwarderAddress)
        await whitelistPaymaster.setRelayHub(relayHubAddress)
        await web3.eth.sendTransaction({from: accounts[0], to: whitelistPaymaster.address, value: 1e18})

        captureFlagContract = await CaptureTheFlag.new(forwarderAddress);

        const gsnProvider = await RelayProvider.newProvider({
            provider: web3.currentProvider,
            config: {
                loggerConfiguration: {logLevel: 'error'},
                paymasterAddress: whitelistPaymaster.address,
                //these 2 params are needed only for ganache:
                methodSuffix: '',
                jsonStringifyRequest: false,
            }
        }).init()

        //during test, "artifacts" initialize the the default web3
        // we need to replace the provider.
        CaptureTheFlag.web3.setProvider(gsnProvider)

        // default ganache accounts all have eth.
        // test from a different account, without any eth
        account = gsnProvider.newAccount().address

        await whitelistPaymaster.whitelistSender(account)
    })

    it('Runs with GSN', async () => {
        const res = await captureFlagContract.captureTheFlag({from: account});
        assert.equal(res.logs[0].event, "FlagCaptured", "Wrong event");
        assert.equal(res.logs[0].args.previousHolder, ZERO_ADDRESS, "Wrong previous flag holder");
        assert.equal(res.logs[0].args.currentHolder, account, "Wrong current flag holder");
    });

    it('Paymaster should reject different account', async () => {
        await captureFlagContract.captureTheFlag({from: accounts[2]})
            .then(() => {
                throw new Error('should revert')
            })
            .catch(() => {
            })
    });
});
