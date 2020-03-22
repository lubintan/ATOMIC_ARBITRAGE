# Atomic Arbitrage

## Purpose

Look for and perform arbitrage within one transaction on the Ethereum blockchain.

Example:
Given token pair ETH and an ERC-20 token XYZ, and 2 on-chain decentralized exchanges A.DEX and B.DEX, look for and perform arbitrage as such:

1. Swap ETH for XYZ on A.DEX.
2. Swap XYZ for ETH on B.DEX.

Try the other way around as well, swapping ETH for XYZ on B.DEX first.

See to it that opportunity exists before performing swap. Otherwise, though the smart contract function will revert, it will still be an avoidable waste of gas.

## Requirements

Contract compilation requires [Truffle](https://www.trufflesuite.com/docs/truffle/getting-started/installation).
This project is currently written to run in NodeJS and via a Geth Light Node.
Other dependencies found in `package.json`.

## For Future

Make use of Flash Loans, such as the ones from [Aave](https://developers.aave.com).
