pragma solidity 0.5.10;
import "./ERC20I.sol";


interface KyberNetworkProxyInterface {
    function swapEtherToToken(ERC20I token, uint minConversionRate) external payable returns(uint);
    function swapTokenToEther(ERC20I token, uint srcAmount, uint minConversionRate) external returns(uint);
    function getExpectedRate(ERC20I src, ERC20I dest, uint srcQty) external view returns(uint expectedRate, uint slippageRate);
    function getUserCapInWei(address user) external view returns(uint);
    function getUserCapInTokenWei(address user, ERC20I token) external view returns(uint);
    function maxGasPrice() external view returns(uint);
    function enabled() external view returns(bool);
    function info(bytes32 field) external view returns(uint);
}