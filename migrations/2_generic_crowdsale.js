const SocietyToken = artifacts.require("./SocietyToken.sol");
const SocietyCrowdsale = artifacts.require("./Crowdsale/SocietyCrowdsale.sol");
const fs = require('fs');
const env = JSON.parse(fs.readFileSync('../config/env.json', 'utf8'));
const config = JSON.parse(fs.readFileSync('../config/config.json', 'utf8'));

module.exports = async (deployer, network, [owner]) => {
  await deployer.deploy(
    SocietyToken,
    config.token.name,
    config.token.symbol,
    config.token.decimals,
    config.token.amount
  );

  const now = Math.floor(Date.now() / 1000);
  const day = 24 * 60 * 60;

  const openingTime = now;
  const closingTime = now + 2 * day;
  const rate = config.preICO.rate;

  const Token = await SocietyToken.deployed();

  await deployer.deploy(SocietyCrowdsale, openingTime, closingTime, rate, owner, SocietyToken.address);

  console.log("Transfering tokens...");
  await Token.transfer(
    SocietyCrowdsale.address,
    config.ICO.transferAmount * (10 ** config.token.decimals),
    { from: owner }
  );
};
