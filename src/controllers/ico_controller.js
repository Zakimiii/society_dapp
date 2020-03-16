import Web3 from "web3";
import { BigNumber } from "bignumber.js";

const SocietyToken = require("../../build/contracts/SocietyToken.json");
const SocietyCrowdsale = require("../../build/contracts/SocietyCrowdsale.json");

const CROWDSALE = "0xbe65b9df7647a78b4cfa1e16ac930fb9c97af9ac";
const eth_decimals = 10 ** 18;

const web3 = new Web3('http://127.0.0.1:8545');
const Crowdsale = new web3.eth.Contract(SocietyCrowdsale.abi, CROWDSALE);
/**
 * show all ico list
 */
exports.index = function(req, res, next) {
  (async () => {
    const rate = await Crowdsale.methods.rate().call();
    const token = await Crowdsale.methods.token().call();
    const Token = new web3.eth.Contract(
      SocietyToken.abi,
      token
    );
    const symbol = await Token.methods.symbol().call();
    const decimals = await Token.methods.decimals().call();
    const left = new BigNumber(
      await Token.methods.balanceOf(CROWDSALE).call()
    );

    const [account] = await web3.eth.getAccounts();
    const balance = new BigNumber(
      await Token.methods.balanceOf(account).call()
    ).toString(10);

    const eth_balance = new BigNumber(
      await web3.eth.getBalance(account)
    ).toString(10);

    res.status(200).json({
      rate,
      symbol,
      decimals,
      left,
      account,
      balance,
      eth_balance,
    });
  })().catch(next);
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
      ([from]) => Crowdsale.methods.buyTokens(
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
