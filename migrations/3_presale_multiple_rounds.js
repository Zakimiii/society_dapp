const SocietyToken = artifacts.require("./SocietyToken.sol");
const PresaleCrowdsale = artifacts.require("./Presale/PresaleCrowdsale.sol");
const fs = require('fs');
const env = JSON.parse(fs.readFileSync('../config/env.json', 'utf8'));
const config = JSON.parse(fs.readFileSync('../config/config.json', 'utf8'));

module.exports = (deployer, network, [owner]) => deployer
// SocietyToken already deployed by the 2nd migration
// .then(() => deployer.deploy(SocietyToken, config.token.name, config.token.symbol, config.token.decimals, config.token.amount))
  .then(() => deployer.deploy(PresaleCrowdsale, config.preICO.rate, owner, SocietyToken.address, owner))
  .then(() => SocietyToken.deployed())
  .then(token => token.increaseApproval(/*PresaleCrowdsale.address*/owner, config.preICO.approval * (10 ** config.token.decimals)));
