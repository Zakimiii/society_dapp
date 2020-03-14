import React from "react";
import Web3 from "web3";
import { render } from "react-dom";
import { BigNumber } from "bignumber.js";

const SocietyToken = require("../../build/contracts/SocietyToken.json");
const SocietyCrowdsale = require("../../build/contracts/SocietyCrowdsale.json");

const CROWDSALE = "0xf075a38c41a57936a2560b2191020b38ce976191";
const eth_decimals = 10 ** 18;

class App extends React.Component {
  constructor(props) {
    super(props);


    this.state = {
      symbol: null,
      rate: 0,
      balance: null,
      eth_balance: null,
      decimals: null,
      left: null,
      amount: 1000,
      closed: false,
    };

    this.changeAmount = this.changeAmount.bind(this);
    this.buy = this.buy.bind(this);
  }

  componentDidMount() {
    this.web3 = new Web3('http://127.0.0.1:8545');
    this.Crowdsale = new this.web3.eth.Contract(SocietyCrowdsale.abi, CROWDSALE);

    this.Crowdsale.methods.rate().call().then((rate) => {
      this.setState({ rate });
    });

    this.Crowdsale.methods.token().call().then((token) => {
      this.Token = new this.web3.eth.Contract(SocietyToken.abi, token);

      this.Token.methods.symbol().call().then((symbol) => {
        this.setState({ symbol });
      });

      this.Token.methods.decimals().call().then((decimals) => {
        this.setState({ decimals: 10 ** decimals });
      });
      this.Token.methods.balanceOf(CROWDSALE).call().then((left) => {
        this.setState({ left: new BigNumber(left) });
      });

      this.web3.eth.getAccounts()
        .then(([account]) => this.Token.methods.balanceOf(account).call())
        .then(balance => this.setState({ balance: new BigNumber(balance) }));

      this.web3.eth.getAccounts()
        .then(([account]) => this.web3.eth.getBalance(account))
        .then(balance => this.setState({ eth_balance: new BigNumber(balance) }));
    });
  }

  getPrice() {
    const { amount, rate } = this.state;
    return amount / rate;
  }

  changeAmount(ev) {
    this.setState({ amount: ev.target.value });
  }

  buy(ev) {
    ev.preventDefault();
    const { decimals, rate } = this.state;
    const value = this.web3.utils.toWei(this.getPrice().toString());
    this.web3.eth.getAccounts().then(
      ([from]) => this.Crowdsale.methods.buyTokens(
        from,
      ).send({
        value,
        from,
      })
    )
  }

  render() {
    let { symbol, balance, eth_balance, amount, decimals, left } = this.state;

    if (!balance) {
      balance = new BigNumber(0);
    }

    if (!eth_balance) {
      eth_balance = new BigNumber(0);
    }

    if (!left) {
      left = new BigNumber(0);
    }

    return (
      <div className="jumbotron">
        <h1 className="display-4">Buy {symbol}, awesome ERC20 token!</h1>
        <p className="lead">See the source to learn how to setup crowdsale landing page</p>
        <hr className="my-4" />
        <p>You own {symbol}: {balance.div(decimals).toString(10)} {symbol}</p>
        <p>You own eth: {eth_balance.div(eth_decimals).toString(10)} ETH</p>
        <p>{left/*.div(decimals)*/.toString(10)} {symbol} is left for sale</p>
        <form onSubmit={this.buy}>
          <div className="input-group mb-3">
            <input type="number" className="form-control" placeholder={`How many ${symbol}s you need?`} onChange={this.changeAmount} value={amount}  required />
            <div className="input-group-append">
              <button className="btn btn-outline-secondary" disabled={!left} type="submit">
                Pay {this.getPrice()} ETH
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

render(<App />, document.querySelector("#app"));
