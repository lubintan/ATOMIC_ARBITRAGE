pragma solidity 0.5.10;

import "../contracts/Owned.sol";
import "../contracts/SafeMath.sol";
import "../contracts/UniSwapI.sol";
import "../contracts/KyberI.sol";


// 0xFd921a6Cb6f4Cbd1516d3D128b47B4672C741b07
// 0xa4f026a91e927E23fE7Ea55fceCC3E3F738b73E1

contract AtomArb_Lite is Owned{
    
    using SafeMath for uint;
    
    UniswapFactoryI usf;
    KyberNetworkProxyInterface kn;
    ERC20I internal ETH_ADDR;
    
    constructor() public 
    {
        usf = UniswapFactoryI(address(0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95));
        kn = KyberNetworkProxyInterface(address(0x818E6FECD516Ecc3849DAf6845e3EC868087B755));
        ETH_ADDR = ERC20I(0x00eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee);
    }
    
    function() external payable {}
    
    // Overall Functions
    function checkIfProfitUtoK(ERC20I token, uint amountEther, uint buffer)
    fromOwner public view returns(bool,uint)
    {
        address uniExAddr = getExchange(address(token));
        uint tokensReceived = getEthToTokenInputPrice(uniExAddr, amountEther);
        
        (uint sellRate,) = getExpectedRate(token, ETH_ADDR, tokensReceived);
        uint resultingAmount = calcDstQty(tokensReceived, token.decimals(), 18, sellRate);
        uint buffered = buffer.add(amountEther);
        
        return (resultingAmount > buffered, resultingAmount);
    }
    
    function checkIfProfitUtoK_Tokens(ERC20I token, uint amountToken, ERC20I token2, uint buffer)
    fromOwner public view returns(bool,uint)
    {
        address uniExAddr = getExchange(address(token));
        uint ethReceived = getTokenToEthInputPrice(uniExAddr, amountToken);
        
        address uniExAddr2 = getExchange(address(token2));
        uint tokens2_Received = getEthToTokenInputPrice(uniExAddr2, ethReceived);
        
        (uint sellRate,) = getExpectedRate(token2, token, tokens2_Received);
        uint resultingAmount = calcDstQty(tokens2_Received, token2.decimals(), token.decimals(), sellRate);
        uint buffered = buffer.add(amountToken);
        
        return (resultingAmount > buffered, resultingAmount);
    }
    
    function checkIfProfitKtoU_Tokens(ERC20I token, uint amountToken, ERC20I token2, uint buffer)
    fromOwner public view returns(bool,uint)
    {
        (uint buyRate,) = getExpectedRate(token, token2, amountToken);
        uint tokens2_Received = calcDstQty(amountToken, token.decimals(), token2.decimals(), buyRate);
        
        address uniExAddr2 = getExchange(address(token2));
        uint ethReceived = getTokenToEthInputPrice(uniExAddr2, tokens2_Received);
        
        address uniExAddr = getExchange(address(token));
        uint resultingAmount = getEthToTokenInputPrice(uniExAddr, ethReceived);
        
        uint buffered = buffer.add(amountToken);
        
        return (resultingAmount > buffered, resultingAmount);
    }
    
    function checkIfProfitKtoU(ERC20I token, uint amountEther, uint buffer)
    fromOwner public view returns(bool,uint)
    {
        address uniExAddr = getExchange(address(token));
        
        (uint buyRate,) = getExpectedRate(ETH_ADDR, token, amountEther);
        uint tokensReceived = calcDstQty(amountEther, 18, token.decimals(), buyRate);
        
        uint resultingAmount = getTokenToEthInputPrice(uniExAddr, tokensReceived);
        
        uint buffered = buffer.add(amountEther);
        
        return (resultingAmount > buffered, resultingAmount);
    }
    
    function setETH_ADDR(address newETH_ADDR)
    fromOwner public returns (address)
    {
        ETH_ADDR = ERC20I(newETH_ADDR);
        
        return address(ETH_ADDR);
    }
    
    
    //ERC20 Functions
    function thisTokenBalance(ERC20I token)
    fromOwner public view returns(uint)
    {
        return token.balanceOf(address(this));
    }
    
    function thisTokenBalanceDetails(ERC20I token)
    fromOwner public view returns(uint, uint, uint)
    {
        uint rawBalance = thisTokenBalance(token);
        uint decimals = token.decimals();
        uint balance = rawBalance/ (10**decimals);
        
        return (balance, rawBalance, decimals);
    }
    
    function flushEther()
    fromOwner public returns(bool success)
    {   
        uint balance = address(this).balance;
        require(balance > 0, "No ether to flush.");
        (bool transferSuccess, ) = msg.sender.call.value(balance)("");
        require(transferSuccess, "Ether transfer failed.");
        success = true;
    }
    
    function flushToken(ERC20I token)
    fromOwner public returns (bool success)
    {
        uint balance = thisTokenBalance(token);
        require(balance > 0, "No tokens to flush.");
        bool transferSuccess = token.transferFrom(address(this), msg.sender, balance);
        require(transferSuccess, "Token transfer failed.");
        success = true;
    }
    
    // UniSwap Functions ======================================
    function setUniSwapContractAddress(address newAddr)
    fromOwner public
    {
        usf = UniswapFactoryI(newAddr);
    }
    
    function getExchange(address token) 
    fromOwner public view returns (address exchange)
    {
        exchange = usf.getExchange(token);
    }
    
    function getToken(address exchange) 
    fromOwner public view returns (address token)
    {
        token = usf.getToken(exchange);
    }
    
    function getEthToTokenInputPrice(address exchange, uint256 eth_sold) 
    fromOwner public view returns (uint256 tokens_bought)
    {
        tokens_bought = UniswapExchangeI(exchange).getEthToTokenInputPrice(eth_sold);
    }
    
    function getTokenToEthInputPrice(address exchange, uint256 tokens_sold) 
    fromOwner public view returns (uint256 eth_bought)
    {
        eth_bought = UniswapExchangeI(exchange).getTokenToEthInputPrice(tokens_sold);
    }

    // Kyber Functions ========================
    function setKNAddr(address newKNAddr) 
    fromOwner public
    {
        kn = KyberNetworkProxyInterface(newKNAddr);
    }

    function getExpectedRate(ERC20I src, ERC20I dest, uint srcQty) public view fromOwner
        returns (uint expectedRate, uint slippageRate)
    {
        (expectedRate, slippageRate) = kn.getExpectedRate(src, dest, srcQty);
    }

    function calcDstQty(uint querySrcAmount, uint srcDecimals, uint destDecimals, uint buyRate)
    public
    pure
    returns (uint)
    {
        if (srcDecimals > destDecimals){
            return querySrcAmount * buyRate / (10**(srcDecimals - destDecimals)) / (10**18);
        }
        else if (destDecimals > srcDecimals){
            return querySrcAmount * (10**(destDecimals - srcDecimals)) * buyRate / (10**18);
        }
        else{
            return querySrcAmount * buyRate / (10**18);
        }
    }
    
    
    function getBalanceEth(address thisContract)
    fromOwner public view returns (uint256)
    {
        return address(thisContract).balance;
    }
    

    function getTimestamp() 
    fromOwner public view returns (uint256)
    {
        return block.timestamp;
    }

    
    
    

    
}