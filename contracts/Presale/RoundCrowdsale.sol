pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/crowdsale/Crowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/emission/AllowanceCrowdsale.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";


contract RoundCrowdsale is AllowanceCrowdsale, TimedCrowdsale {
  constructor(
    uint256 _rate,
    address _wallet,
    ERC20 _token,
    address _tokenWallet,
    uint256 _openingTime,
    uint256 _closingTime
  )
    Crowdsale(_rate, _wallet, _token)
    AllowanceCrowdsale(_tokenWallet)
    TimedCrowdsale(_openingTime, _closingTime)
    public
  {}
}
