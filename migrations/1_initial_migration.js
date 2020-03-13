const Migrations = artifacts.require("./Migrations.sol");

module.exports = async (deployer, network, [owner]) => {
  await deployer.deploy(Migrations);
};
