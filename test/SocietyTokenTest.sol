pragma solidity 0.4.24;

import "truffle/Assert.sol";
import "../contracts/SocietyToken.sol";


contract SocietyTokenTest {
  SocietyToken token;
  uint256 public constant TOTAL_SUPPLY = 21000000000000000000000000;

  function beforeEach() public {
    token = new SocietyToken("Tooploox", "TPX", 18, 21000000);
  }

  function testSettingDetails() public {
    Assert.equal(token.name(), "Tooploox", "name is invalid");
    Assert.equal(token.symbol(), "TPX", "symbol is invalid");
    Assert.equal(uint(token.decimals()), uint(18), "decimals is invalid");
  }

  function testSettingTotalSupply() public {
    Assert.equal(token.totalSupply(), TOTAL_SUPPLY, "total supply is invalid");
  }

  function testTransferSenderTotalSupply() public {
    Assert.equal(
      token.balanceOf(address(this)),
      TOTAL_SUPPLY,
      "total supply not transfered to the sender"
    );
  }
}
