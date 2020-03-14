import Web3 from "web3";
import { BigNumber } from "bignumber.js";

const SocietyToken = require("../../build/contracts/SocietyToken.json");
const SocietyCrowdsale = require("../../build/contracts/SocietyCrowdsale.json");

const CROWDSALE = "0x3135bdf8a67429799864ab9157954009d695381d";
const eth_decimals = 10 ** 18;

const web3 = new Web3('http://127.0.0.1:8545');
const Crowdsale = new web3.eth.Contract(SocietyCrowdsale.abi, CROWDSALE);

/**
 * show all ico list
 */
exports.index = function(req, res, next) {
};

/**
 * buy ico
 */
exports.buy = function(req, res, next) {
  const {
    address,
    amount,
  } = req.body;

  Crowdsale.methods.rate().call().then((rate) => {
    const value = Number(amount) / rate;
    web3.eth.getAccounts().then(
      ([from]) => this.Crowdsale.methods.buyTokens(
        from
      ).send({
        value,
        from,
      })
    ).then((result) => {
      res.json({ success: true, result });
    }).catch(error => {
      res.json({ success: false, error });
    });
  });
};
