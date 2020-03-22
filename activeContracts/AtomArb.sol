pragma solidity 0.5.10;

import "../contracts/Owned.sol";
import "../contracts/SafeMath.sol";
import "../contracts/UniSwapI.sol";
import "../contracts/KyberI.sol";

// 0xa4f026a91e927E23fE7Ea55fceCC3E3F738b73E1

contract AtomArb is Owned{
    
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
    
    function performUtoK(ERC20I token, uint amountEther, uint buffer) 
    fromOwner payable public
    {
        (bool result,) = checkIfProfitUtoK(token, amountEther, buffer);
        require(result, "Not profitable.");
        
        uint initialBalance = address(this).balance;
        
        address uniExAddr = getExchange(address(token));
        
        uint tokensReceived = ethToTokenSwapInput(uniExAddr, 1, now + 1 hours, amountEther);
        
        swapTokenToEther(token, tokensReceived, 1);
        
        uint finalBalance = address(this).balance;
        
        uint buffered = buffer.add(initialBalance);
        
        require(finalBalance > buffered, "Unprofitable Tx.");
        
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
    
    function performKtoU(ERC20I token, uint amountEther, uint buffer)
    fromOwner public payable returns (bool)
    {
        (bool result,) = checkIfProfitKtoU(token, amountEther, buffer);
        require(result, "Not profitable.");
        
        uint initialBalance = address(this).balance;
        
        address uniExAddr = getExchange(address(token));
        
        uint tokensReceived = swapEtherToToken(token, 1, amountEther);
        
        tokenToEthSwapInput(token, uniExAddr, tokensReceived, 1, now + 1 hours);
        
        uint finalBalance = address(this).balance;
        uint buffered = buffer.add(initialBalance);
        
        require(finalBalance > buffered, "Unprofitable Tx.");
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
    
    // Trade ETH to ERC20
    function ethToTokenSwapInput(address exchange, uint256 min_tokens, uint256 deadline, uint256 amount) 
    fromOwner public returns (uint256  tokens_bought)
    {
        tokens_bought = UniswapExchangeI(exchange).ethToTokenSwapInput.value(amount)(min_tokens, deadline);
    }
    
    // Trade ERC20 to ETH
    function tokenToEthSwapInput(ERC20I token, address exchange, uint256 tokens_sold, uint256 min_eth, uint256 deadline) 
    fromOwner public returns (uint256  eth_bought)
    {
        token.approve(exchange, tokens_sold);
        eth_bought = UniswapExchangeI(exchange).tokenToEthSwapInput(tokens_sold, min_eth, deadline);
    }

    // Kyber Functions ========================
    function setKNAddr(address newKNAddr) 
    fromOwner public
    {
        kn = KyberNetworkProxyInterface(newKNAddr);
    }

    function enabled() 
    fromOwner public view returns (bool)
    {
        return kn.enabled();
    }

    function getUserCapInWei() public view fromOwner returns (uint)
    {
        return kn.getUserCapInWei(msg.sender);
    }

    function getUserCapInTokenWei(address tokenAddr) public view fromOwner returns(uint)
    {
        return kn.getUserCapInTokenWei(msg.sender, ERC20I(tokenAddr));
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
    
    function swapTokenToEther(ERC20I token, uint srcAmount, uint minConversionRate) 
    fromOwner public returns (uint)
    {
        token.approve(address(kn), srcAmount);
        return kn.swapTokenToEther(token, srcAmount, minConversionRate);
    }
    
    function swapEtherToToken(ERC20I token, uint minConversionRate, uint amountEther)
    public
    fromOwner
    returns (uint){
        return kn.swapEtherToToken.value(amountEther)(token, minConversionRate);
    }
    

    function getTimestamp() 
    fromOwner public view returns (uint256)
    {
        return block.timestamp;
    }

    
    
    

    
}