const ethers = require('ethers')
const {RelayProvider} = require('@opengsn/provider')

const paymasterAddress = require('../build/gsn/Paymaster').address
const contractArtifact = require('../build/contracts/CaptureTheFlag.json')
const contractAbi = contractArtifact.abi

let theContract
let provider
let gsnProvider

async function initContract() {

    if (!window.ethereum) {
        throw new Error('provider not found')
    }
    window.ethereum.on('accountsChanged', () => {
        console.log('acct');
        window.location.reload()
    })
    window.ethereum.on('chainChanged', () => {
        console.log('chainChained');
        window.location.reload()
    })
    const networkId = await window.ethereum.request({method: 'net_version'})

    gsnProvider = await RelayProvider.newProvider({
        provider: window.ethereum,
        config: {
            loggerConfiguration: {logLevel: 'debug'},
            paymasterAddress
        }
    }).init()

    provider = new ethers.providers.Web3Provider(gsnProvider)

    const network = await provider.getNetwork()
    const artifactNetwork = contractArtifact.networks[networkId]
    if (!artifactNetwork)
        throw new Error('Can\'t find deployment on network ' + networkId)
    const contractAddress = artifactNetwork.address
    theContract = new ethers.Contract(
        contractAddress, contractAbi, provider.getSigner())

    await listenToEvents()
    return {contractAddress, network}
}

async function contractCall() {
    await window.ethereum.send('eth_requestAccounts')

    const txOptions = {gasPrice: await provider.getGasPrice()}
    const transaction = await theContract.captureTheFlag(txOptions)
    const hash = transaction.hash
    console.log(`Transaction ${hash} sent`)
    const receipt = await transaction.wait()
    console.log(`Mined in block: ${receipt.blockNumber}`)
}

let logview

function log(message) {
    message = message.replace(/(0x\w\w\w\w)\w*(\w\w\w\w)\b/g, '<b>$1...$2</b>')
    if (!logview) {
        logview = document.getElementById('logview')
    }
    logview.innerHTML = message + "<br>\n" + logview.innerHTML
}

async function listenToEvents() {

    theContract.on('FlagCaptured', (previousHolder, currentHolder, rawEvent) => {
        log(`Flag Captured from&nbsp;${previousHolder} by&nbsp;${currentHolder}`)
        console.log(`Flag Captured from ${previousHolder} by ${currentHolder}`)
    })
}

window.app = {
    initContract,
    contractCall,
    log
}

