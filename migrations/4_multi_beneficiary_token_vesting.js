const fs = require('fs');
const env = JSON.parse(fs.readFileSync('../config/env.json', 'utf8'));
const config = JSON.parse(fs.readFileSync('../config/config.json', 'utf8'));

const now = Math.floor(Date.now() / 1000);
const day = 24 * 60 * 60;

const beneficiaries = [
  {
    address: "0xC4DEBC682A2056c7c4BF02465A167b5E125e9592",
    shares: 15,
  },
  {
    address: "0x96b020d7D25B785F078875953FCc2a420FbF6fe9",
    shares: 20,
  },
];

const tokenSettings = {
  name: "Tooploox",
  symbol: "TPX",
  decimals: 18,
  amount: 3000000,
};

const vestingSettings = {
  start: now + day,
  cliff: 365 * day,
  duration: 3 * 365 * day,
};

const crowdsaleSettings = {
  openingTime: now + day,
  closingTime: now + 2 * day,
  rate: 100,
};

const SocietyCrowdsale = artifacts.require("./Crowdsale/SocietyCrowdsale.sol");
const SocietyToken = artifacts.require("./SocietyToken.sol");
const MultiBeneficiaryTokenVesting = artifacts.require("./Vesting/MultiBeneficiaryTokenVesting.sol");

module.exports = (deployer, network, [owner]) => deployer
  .then(() => deployToken(deployer))
  .then(() => deployMultiBeneficiaryTokenVestingContract(deployer))
  .then(() => transferTokensToVestingContract(owner))
  .then(() => addBeneficiariesToVestingContract(owner))
  .then(() => deployCrowdsale(deployer, owner))
  .then(() => transferRemainingTokensToCrowdsale(owner))
  .then(() => displaySummary());

function deployToken(deployer) {
  return deployer.deploy(
    SocietyToken,
    tokenSettings.name,
    tokenSettings.symbol,
    tokenSettings.decimals,
    tokenSettings.amount,
  );
}

function deployMultiBeneficiaryTokenVestingContract(deployer) {
  return deployer.deploy(
    MultiBeneficiaryTokenVesting,
    SocietyToken.address,
    vestingSettings.start,
    vestingSettings.cliff,
    vestingSettings.duration,
  );
}

function deployCrowdsale(deployer, owner) {
  return deployer.deploy(
    SocietyCrowdsale,
    crowdsaleSettings.openingTime,
    crowdsaleSettings.closingTime,
    crowdsaleSettings.rate,
    owner,
    SocietyToken.address,
  );
}

async function transferTokensToVestingContract(owner) {
  const sharesSum = beneficiaries.reduce((sharesSum, beneficiary) => sharesSum + beneficiary.shares, 0);
  return (await SocietyToken.deployed()).transfer(
    MultiBeneficiaryTokenVesting.address,
    calculateNumberOfTokensForSharesPercentage(sharesSum),
  );
}

function calculateNumberOfTokensForSharesPercentage(shares) {
  return tokenSettings.amount * shares / 100;
}

async function addBeneficiariesToVestingContract(owner) {
  return Promise.all(
    beneficiaries.map(async (beneficiary) => {
      (await MultiBeneficiaryTokenVesting.deployed()).addBeneficiary(
        beneficiary.address,
        beneficiary.shares,
      );
    }),
  );
}

async function transferRemainingTokensToCrowdsale(owner) {
  (await SocietyToken.deployed()).transfer(
    SocietyCrowdsale.address,
    calculateRemainingTokens(),
  );
}

function calculateRemainingTokens() {
  return tokenSettings.amount * calculateRemainingTokensPercentage() / 100;
}

function calculateRemainingTokensPercentage() {
  return beneficiaries.reduce((remaning, beneficiary) => remaning - beneficiary.shares, 100);
}

async function displaySummary() {
  const vestingInstance = (await MultiBeneficiaryTokenVesting.deployed());
  const tokenInstance = (await SocietyToken.deployed());
  console.log(`
    ==========================================================================================
       Deployed Contracts:
       SocietyToken: ${SocietyToken.address}
       SocietyCrowdsale: ${SocietyCrowdsale.address}
       MultiBeneficiaryTokenVesting: ${MultiBeneficiaryTokenVesting.address}
       Balances:
       MultiBeneficiaryTokenVesting (${MultiBeneficiaryTokenVesting.address}) => ${await tokenInstance.balanceOf(MultiBeneficiaryTokenVesting.address)} tokens
       Crowdsale (${SocietyCrowdsale.address}) => ${await tokenInstance.balanceOf(SocietyCrowdsale.address)} tokens
       Beneficiaries: ${
        beneficiaries.map(b => `${b.address} => ${vestingInstance.contract.shares(b.address)} shares`).join("\n       ")
      }
    ==========================================================================================
  `);
}


