import React from "react";
import Web3 from "web3";
import { render } from "react-dom";
import { BigNumber } from "bignumber.js";

const SimpleToken = require("../../build/contracts/SocietyToken.json");
const GenericCrowdsale = require("../../build/contracts/SocietyToken.json");

const CROWDSALE = "0x68d8ad07e01145aaa81102de1e9f3623c6bc50c3";
const defaultAccount = "0xe2B539410e2FF2dE4403Cc379CFc794Af2D5C74f";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      symbol: null,
      rate: 0,
      balance: null,
      decimals: null,
      left: null,
      amount: 1000,
    };

    this.changeAmount = this.changeAmount.bind(this);
    this.buy = this.buy.bind(this);
  }

  componentDidMount() {
    // const provider = new HDWalletProvider(
    //   "spend fatal draft cousin prize broccoli method habit divorce brand help quit",
    //   `https://ropsten.infura.io/v3/01299627d9ec4feda61d26c74955af4c`
    // );

    // const provider = new Web3.providers.HttpProvider(
    //   'https://ropsten.infura.io/v3/01299627d9ec4feda61d26c74955af4c'
    // )

    this.web3 = new Web3(Web3.givenProvider);
    this.web3 = new Web3(provider);
    this.Crowdsale = new this.web3.eth.Contract(GenericCrowdsale.abi, CROWDSALE);

    this.Crowdsale.methods.rate().call().then((rate) => {
      this.setState({ rate });
    }).catch(e => {
      console.log(e);
    })

    this.Crowdsale.methods.token().call().then((token) => {
      this.Token = new this.web3.eth.Contract(SimpleToken.abi, token);

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
        .then(([account]) => this.Token.methods.balanceOf(account || defaultAccount).call())
        .then(balance => this.setState({ balance: new BigNumber(balance) }));
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
    const { decimals } = this.state;
    const value = this.getPrice() * decimals;

    this.web3.eth.getAccounts()
      .then(([from]) => this.Crowdsale.methods.buyTokens(from || defaultAccount).send({ value, from: from || defaultAccount }));
  }

  render() {
    let { symbol, balance, amount, decimals, left } = this.state;

    // if (!balance || !left) return null;
    if (!balance) {
      balance = new BigNumber(0);
    }

    if (!left) {
      left = new BigNumber(0);
    }

    return (
      <div className="jumbotron">
        <h1 className="display-4">Buy {symbol}, awesome ERC20 token!</h1>
        <p className="lead">See the source to learn how to setup crowdsale landing page</p>
        <hr className="my-4" />
        <p>You own: {balance.div(decimals).toString()} {symbol}</p>
        <p>{left.div(decimals).toString()} {symbol} is left for sale</p>
        <form onSubmit={this.buy}>
          <div className="input-group mb-3">
            <input type="number" className="form-control" placeholder={`How many ${symbol}s you need?`} onChange={this.changeAmount} value={amount} min="1" required />
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