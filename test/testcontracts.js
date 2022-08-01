const CaptureTheFlag = artifacts.require('CaptureTheFlag')

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

contract("CaptureTheFlag", async accounts => {

    let account
    let captureFlagContract

    before(async () => {
        captureFlagContract = await CaptureTheFlag.new();

        account = accounts[0]
    })

    it('Runs without GSN', async () => {
        const res = await captureFlagContract.captureTheFlag({from: account});
        assert.equal(res.logs[0].event, "FlagCaptured", "Wrong event");
        assert.equal(res.logs[0].args.previousHolder, ZERO_ADDRESS, "Wrong previous flag holder");
        assert.equal(res.logs[0].args.currentHolder, account, "Wrong current flag holder");
    });

});
