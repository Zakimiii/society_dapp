const SocietyToken = artifacts.require("./SocietyToken.sol");
const SocietyCrowdsale = artifacts.require("./Crowdsale/SocietyCrowdsale.sol");
const fs = require('fs');
const env = JSON.parse(fs.readFileSync('../config/env.json', 'utf8'));
const config = JSON.parse(fs.readFileSync('../config/config.json', 'utf8'));

module.exports = async (deployer, network, [owner]) => {
  await deployer.deploy(SocietyToken, "Tooploox", "TPX", 18, 21000000);

  const now = Math.floor(Date.now() / 1000);
  const day = 24 * 60 * 60;

  const openingTime = now;
  const closingTime = now + 2 * day;
  const rate = 1000;

  const Token = await SocietyToken.deployed();

  await deployer.deploy(SocietyCrowdsale, openingTime, closingTime, rate, owner, SocietyToken.address);

  console.log("Transfering tokens...");
  await Token.transfer(SocietyCrowdsale.address, 20000000 * (10 ** 18), { from: owner });
};
