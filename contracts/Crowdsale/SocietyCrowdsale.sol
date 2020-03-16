pragma solidity ^0.4.23;

import "../SocietyToken.sol";
import "openzeppelin-solidity/contracts/crowdsale/validation/TimedCrowdsale.sol";


contract SocietyCrowdsale is TimedCrowdsale {
  constructor
  (
    uint256 _openingTime,
    uint256 _closingTime,
    uint256 _rate,
    address _wallet,
    ERC20 _token
  )
    Crowdsale(_rate, _wallet, _token)
    TimedCrowdsale(_openingTime, _closingTime)
    public
  {}

  function hasOpened() public view returns (bool) {
    // solium-disable-next-line security/no-block-members
    return block.timestamp >= openingTime;
  }
}
