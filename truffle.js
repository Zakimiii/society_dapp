const fs = require('fs');
const HDWalletProvider = require("truffle-hdwallet-provider");
const web3 = require("web3-utils");
const env = JSON.parse(fs.readFileSync('./config/env.json', 'utf8'));

module.exports = {
  compilers: {
    solc: {
      version: "0.4.24",
    },
  },
  networks: {
    ropsten: {
      provider: function() {
        return new HDWalletProvider(
          env.MNENOMIC,
          `https://ropsten.infura.io/v3/${env.INFURA_API_KEY}`
        );
      },
      network_id: "*",
      // gas: 2423679,
      // gasPrice: 2100,
      from: env.owner,
    },
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      // from: env.owner
    },
  }
};
