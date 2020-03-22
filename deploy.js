const Web3 = require('web3');
const net = require('net');
const truffleContract = require('truffle-contract');
const NewContractJson = require("./build/KNP_Interactor.json");

// const ethereumUri = 'http://localhost:7752';
// let web3 = new Web3();
// web3.setProvider(new web3.providers.(ethereumUri));
const web3 = new Web3('/Users/lubin/Library/Ethereum/testnet/geth.ipc', net);
const { toBN, fromWei } = web3.utils;

const newContract = truffleContract(NewContractJson);
newContract.setProvider(web3.currentProvider);
// console.log('connected to ethereum node at ' + web3.currentProvider);

const gasPrice = toBN(50e9); // 100 GWEI

const deploy = async function(){

    try{
        let accounts = await web3.eth.getAccounts();
        let acct0 = accounts[0];
        let balance = await web3.eth.getBalance(acct0);

        console.log("Active Account:", acct0);
        console.log('balance:' + fromWei(balance, 'ether') + " ETH");

        let instance = await newContract.new({
            from: acct0,
            gasPrice: gasPrice
        });

        // console.log(instance);
        console.log(instance.address);

        balance = await web3.eth.getBalance(acct0);

        console.log("Active Account:", acct0);
        console.log('Final balance:' + fromWei(balance, 'ether') + " ETH");

        process.exit(0);

    }catch(e){
        console.log(e.toString());
    }

}

deploy();