# GSN v3 integration workshop

### (Base branch - before adding any GSN support)

This sample dapp emits an event with the last account that clicked on the "capture the flag" button. We will integrate
this dapp to work gaslessly with GSN v3. This will allow an externally owned account without ETH to capture the flag by
signing a meta transaction.


### To run the sample:

1. first clone and `yarn install`
2. run `yarn ganache`
3. Make sure you have Metamask installed, and pointing to "localhost
4. run `truffle init` and set the network in `truffle-config.js`
4. In a different window, run `yarn start`, to deploy the contract, and start the UI
5. Start a browser pointing to "http://localhost:3000"
6. Click the "Capture the Flag" button. Notice that you do need an account with eth for that..

You can see the integrations as GitHub pull requests:

1. [Basic: Minimum viable GSN integration](https://github.com/opengsn/workshop/pull/1/files)
2. [Advanced: Write your own custom Paymaster](https://github.com/opengsn/workshop/pull/2/files_)

Note: on testnet we maintain a public service "pay for everything" paymaster so writing your own is not strictly
required. On mainnet, you need a custom paymaster, such as a token paymaster that allow users to pay for gas in tokens,
and exchanging them for ETH ETH on Uniswap. Dapps will want to develop their own custom paymaster in order, for example
to subsidize gas fees for new users during the onboarding process.

### Further reading

GSNv3 integration tutorial: https://docs.opengsn.org/tutorials

Documentation explaining how everything works: https://docs.opengsn.org/
