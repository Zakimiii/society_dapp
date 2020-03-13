pragma solidity ^0.4.23;

import "openzeppelin-solidity/contracts/token/ERC20/TokenVesting.sol";


contract SocietyTokenVesting is TokenVesting {
  constructor(
    address _beneficiary,
    uint256 _start,
    uint256 _cliff,
    uint256 _duration,
    bool _revocable
  )
    TokenVesting(_beneficiary, _start, _cliff, _duration, _revocable)
    public
  {}
}
