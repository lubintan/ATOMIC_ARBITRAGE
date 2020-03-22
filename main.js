const Web3 = require('web3');
const sleep = require('sleep-promise');
const Tx = require("ethereumjs-tx").Transaction;
const net = require('net');
const web3 = new Web3('/Users/lubin/Library/Ethereum/geth.ipc', net);
const { toBN, fromWei } = web3.utils;
const aaContractJson = require("./build/AtomArb.json");
// const currencies = require("./build/KyberCurrencies.json");

const aaContractAddress = "0xFd921a6Cb6f4Cbd1516d3D128b47B4672C741b07";
const mainAcct = "0x0E6fd1D796927acb1C084809dDf90902acEd3A84";

const instance = new web3.eth.Contract(
    aaContractJson.abi,
    aaContractAddress
);

const gasPrice = toBN(6e9); // 6 GWEI
const gas = toBN(3e6);
const nomGasCost = 600000;
const nomFee = toBN(nomGasCost).mul(gasPrice);
const stepValue = toBN(2.5e17);

console.log("Nom Fee:", nomFee.toString());

// const BUSD = "0x4fabb145d64652a948d72533023f6e7a623c7c53";
// const LEO = "0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3";
// const HT = "0x6f259637dcd74c767781e37bc6133cd6a68aa161";
// const NEXO = "0xb62132e35a6c13ee1ee0f84dc5d40bad8d815206";
// const HEDG = "0xf1290473e210b2108a85237fbcd7b6eb42cc654f";
// const CRO = "0xa0b73e1ff0b80914ab6fe0444e65848c4c34450b";
// const OKB = "0x75231f58b43240c9718dd58b4967c5114342a86c";

const BNB = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52";
const ZIL = "0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27";
const WETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
const KNC = "0xdd974d5c2e2928dea5f71b9825b8b646686bd200";
const SAI = "0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359";
const DAI = "0x6b175474e89094c44da98b954eedeac495271d0f";
// const OMG = "0xd26114cd6ee289accf82350c8d8487fedb8a0c07";
const SNT = "0x744d70fdbe2ba4cf95131626614a1763df805b9e";
// const ELF = "0xbf2179859fc6d5bee9bf9158632dc51678a4100e";
const POWR = "0x595832f8fc6bf59c85c527fec3740a1b7a361269";
const MANA = "0x0f5d2fb29fb7d3cfee444a200298f468908cc942";
const BAT = "0x0d8775f648430679a709e98d2b0cb6250d2887ef";
const REQ = "0x8f8221afbb33998d8584a2b05749ba73c37a938a";
const RDN = "0x255aa6df07540cb5d3d297f0d0d4d84cb52bc8e6";
// const APPC = "0x1a7a8bd9106f2b8d977e08582dc7d24c723ab0db";
const BQX = "0x5af2be193a6abca9c8817001f45744777db30756";
const AST = "0x27054b13b1b798b345b591a4d22e6562d47ea75a";
const LINK = "0x514910771af9ca656af840dff83e8264ecf986ca";
const DGX = "0x4f3afec4e5a3f2a6a1a411def7d7dfe50ee057bf";
const STORM = "0xd0a4b8946cb52f0661273bfbc6fd0e0c75fc6433";
// const IOST = "0xfa1a856cfa3409cfa145fa4e20eb270df3eb21ab";
// const ABT = "0xb98d4c97425d9908e66e53a6fdf673acca0be986";
const ENJ = "0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c";
const BLZ = "0x5732046a883704404f284ce41ffadd5b007fd668";
const POLY = "0x9992ec3cf6a55b00978cddf2b27bc6882d88d1ec";
const CVC = "0x41e5560054824ea6b0732e656e3ad64e20e94e45";
const POE = "0x0e0989b1f9b8a38983c2ba8053269ca62ec9b195";
// const PAY = "0xb97048628db6b661d4c2aa833e95dbe1a905b280";
// const DTA = "0x69b148395ce0015c13e36bffbad63f49ef874e03";
const BNT = "0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c";
const TUSD = "0x8dd5fbce2f6a956c3022ba3663759011dd51e73e";
const LEND = "0x80fb784b7ed66730e8b1dbd9820afd29931aab03";
// const MTL = "0xf433089366899d83a9f26a773d59ec7ecf30355e";
// const MOC = "0x865ec58b06bf6305b886793aa20a2da31d034e68";
const REP = "0x1985365e9f78359a9b6ad760e32412f4a445e862";
const ZRX = "0xe41d2489571d322189246dafa5ebde1f4699f498";
// const DAT = "0x81c9151de0c8bafcd325a57e3db5a5df1cebf79c";
const REN = "0x408e41876cccdc0f92210600ef50372656052a38";
// const QKC = "0xea26c4ac16d4a5a106820bc8aee85fd0b7b2b664";
const MKR = "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2";
// const EKO = "0xa6a840e50bcaa50da017b91a0d86b8b2d41156ee";
const OST = "0x2c4e8f2d746113d0696ce89b35f0d8bf88e0aeca";
// const PT = "0x094c875704c14783049ddf8136e298b3a099c446";
// const ABYSS = "0x0e8d6b471e332f140e7d9dbb99e5e3822f728da6";
const WBTC = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";
const MLN = "0xec67005c4e498ec7f55e092bd1d35cbc47c91892";
const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
// const EURS = "0xdb25f211ab05b1c97d595516f45794528a807ad8";
// const CDT = "0x177d39ac676ed1c67a2b268ad7f1e58826e5b0af";
const MCO = "0xb63b606ac810a52cca15e44bb630fd42d8d1d83d";
const PAX = "0x8e870d67f660d95d5be530380d0ec0bd388289e1";
const GEN = "0x543ff227f64aa17ea132bf9886cab5db55dcaddf";
const LRC = "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd";
const RLC = "0x607f4c5bb672230e8672085532f7e901544a7375";
// const NPXS = "0xa15c7ebe1f07caf6bff097d8a589fb8ac49ae5b3";
const GNO = "0x6810e776880c02933d47db1b9fc05908e5386b96";
const MYB = "0x5d60d8d7ef6d37e16ebabc324de3be57f135e0bc";
// const BAM = "0x22b3faaa8df978f6bafe18aade18dc2e3dfa0e0c";
// const SPN = "0x20f7a3ddf244dc9299975b4da1c39f8d5d75f05a";
// const EQUAD = "0xc28e931814725bbeb9e670676fabbcb694fe7df2";
// const UPP = "0xc86d054809623432210c107af2e3f619dcfbf652";
// const CND = "0xd4c435f5b09f855c3317c8524cb1f586e42795fa";
// const USDT = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const SNX = "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f";
const BTU = "0xb683d83a532e2cb7dfa5275eed3698436371cc9f";
const TKN = "0xaaaf91d9b90df800df4f55c205fd6989c977e73a";
// const RAE = "0xe5a3229ccb22b6484594973a03a3851dcd948756";
const WABI = "0x286bda1413a2df81731d4930ce2f862a35a609fe";
// const EDO = "0xced4e93198734ddaff8492d525bd258d49eb388e";
const SUSD = "0x57ab1ec28d129707052df4df418d58a2d46d5f51";
// const SPIKE = "0xa7fc5d2453e3f68af0cc1b78bcfee94a1b293650";
const SAN = "0x7c5a0ce9267ed19b22f8cae653f198e3e8daf098";
const USDS = "0xa4bdb11dc0a2bec88d24a3aa1e6bb17201112ebe";
// const NEXXO = "0x278a83b64c3e3e1139f8e8a52d96360ca3c69a3d";
// const EKG = "0x6a9b3e36436b7abde8c4e2e2a98ea40455e615cf";
const ANT = "0x960b236a07cf122663c4303350609a66a7b288c0";
// const GDC = "0x301c755ba0fca00b1923768fffb3df7f4e63af31";
const AMPL = "0xd46ba6d942050d489dbd938a2c909a5d5039a161";
// const TKX = "0x667102bd3413bfeaa3dffb48fa8288819e480a88";
const MET = "0xa3d58c4e56fedcae3a7c43a725aee9a71f0ece4e";
// const MFG = "0x6710c63432a2de02954fc0f851db07146a6c0312";
const FXC = "0x4a57e687b9126435a9b19e4a802113e266adebde";
const UBT = "0x8400d94a5cb0fa0d041a3788e395285d61c9ee5e";
const LOOM = "0xa4e8c3ec456107ea67d3075bf9e3df3a75823db0";
const PBTC = "0x5228a22e72ccc52d415ecfd199f99d0665e7733b";
// const OGN = "0x8207c1ffc5b6804f6024322ccf34f29c3541ae26";

const currencies = [
    // BUSD,LEO,HT,NEXO,HEDG,CRO,BNB,ZIL,
    WETH,KNC,SAI,DAI,SNT,POWR,MANA,BAT,REQ,RDN,BQX,AST,LINK,DGX,STORM,ENJ,BLZ,POLY,CVC,POE,
BNT,TUSD,LEND,REP,ZRX,REN,MKR,OST,WBTC,MLN,USDC,MCO,PAX,GEN,LRC,RLC,GNO,MYB,
SNX,BTU,TKN,WABI,SUSD,SAN,USDS,ANT,AMPL,MET,FXC,UBT,LOOM,PBTC
];

const err1 = "Error: Returned values aren't valid";
console.log("setup phase complete");


const performUtoK = async function(token, amountEther, buffer){
    while(true){   
        try{
            console.log("Coin:", token);
            console.log("Amount Eth:", fromWei(amountEther,'ether'));

            let result = await instance.methods.performUtoK(token, amountEther, buffer).send(
                {from: mainAcct, gasPrice: gasPrice, gas:gas}
                );

            console.log("U-to-K Tx sent!\n", result);
            return true;
        }catch(e){
            console.log(e.toString());
            return false;
        }
    }
} 

const performKtoU = async function(token, amountEther, buffer){
    while(true){
        try{
            console.log("Coin:", token);
            console.log("Amount Eth:", fromWei(amountEther,'ether'));

            let result = await instance.methods.performKtoU(token, amountEther, buffer).send(
                {from: mainAcct, gasPrice: gasPrice, gas:gas}
                );

            console.log("K-to-U Tx sent!\n", result);
            return true;   
        }catch(e){
            console.log(e.toString());
            return false;
        }
    }
} 

const checkUtoK = async function(token, amountEther, buffer){
    while(true){
        try{
            let result;
            result = await instance.methods.checkIfProfitUtoK(token, amountEther, buffer)
                    .call();
                    
            return result;
        }catch(e){
            let errorString = e.toString();
            // console.log(errorString);

            if (errorString.includes(err1)){
                console.log("______________________________________________");
                break;
            }
            continue;
        }
    }
}

const checkKtoU = async function(token, amountEther, buffer){
     while(true){   
        try{
            let result;
            result = await instance.methods.checkIfProfitKtoU(token, amountEther, buffer)
                    .call({gas: gas});
            return result;
        }catch(e){
            let errorString = e.toString();
                // console.log(errorString);
                
                if (errorString.includes(err1)){
                    console.log("______________________________________________");
                    break;
                }
                continue;
        }
    }
}

const main = async function(){
    try{
        let resultUtoK, resultKtoU;
        let testAmount;

        let balance = toBN(5e17);
        let winCount = 0;
        let mainAcctBalance = toBN(await web3.eth.getBalance(mainAcct));
        let contractBalance = toBN(await web3.eth.getBalance(aaContractAddress));
        console.log("Contract Balance:", fromWei(contractBalance, 'ether'),
        "Balance:", fromWei(mainAcctBalance,'ether'), "Nom Fees:", fromWei(nomFee,'ether'),
        "\nTotal Initial Balance:", fromWei(mainAcctBalance.add(contractBalance), 'ether'));

        while(true){
            
            console.log("\n********************************************\n")

            let counter = 0;
            for(coin of currencies){
                try{
                    resultUtoK = await checkUtoK(coin, balance, nomFee);

                    if (resultUtoK["0"]){
                        console.log("\n==================== Found U-to-K Opportunity ====================");
                        console.log(balance.toString(),resultUtoK);

                        testAmount = balance;

                        while(true){

                            let thisResult = await checkUtoK(coin, testAmount.add(stepValue), nomFee);
                            console.log(testAmount.add(stepValue).toString(),thisResult);
                            console.log((thisResult["0"])==false);
                            console.log((testAmount.add(stepValue).gt(contractBalance)));

                            if ((testAmount.add(stepValue).gt(contractBalance)) || (thisResult["0"])==false){
                                let success = await performUtoK(coin, testAmount, nomFee);

                                if (success){
                                    console.log("Tx Completed.");
                                    console.log("Coin:", coin);
                                    console.log("Amount Eth:", fromWei(testAmount,'ether'));
                                    winCount = winCount+1;
                                    break;
                                }else{
                                    console.log("Unable to capitalize.");
                                    break;
                                }
                            } else{
                                testAmount = testAmount.add(stepValue);
                                console.log("Trying with Eth amount:", fromWei(testAmount,'ether'))
                            }
                        }
                    }

                    resultKtoU = await checkKtoU(coin, balance, nomFee);                    
                    if (resultKtoU["0"]){
                        console.log("\n==================== Found K-to-U Opportunity ====================");
                        console.log(balance.toString(),resultKtoU);

                        testAmount = balance;

                        while(true){

                            let thisResult = await checkKtoU(coin, testAmount.add(stepValue), nomFee);
                            console.log(testAmount.add(stepValue).toString(),thisResult);
                            console.log((thisResult["0"])==false);
                            console.log((testAmount.add(stepValue).gt(contractBalance)));


                            if ((testAmount.add(stepValue).gt(contractBalance)) || (thisResult["0"])==false){
                                let success = await performKtoU(coin, testAmount, nomFee);

                                if (success){
                                    console.log("Tx Completed.");
                                    console.log("Coin:", coin);
                                    console.log("Amount Eth:", fromWei(testAmount,'ether'));
                                    winCount = winCount+1;
                                    break;
                                } else{
                                    console.log("Unable to capitalize.");
                                    break;
                                }
                            } else{
                                testAmount = testAmount.add(stepValue);
                                console.log("Trying with Eth amount:", fromWei(testAmount,'ether'));
                            }
                        }

                    }

                }catch(e){
                    continue;
                }
                
                counter = counter + 1;

            }

            console.log("Tried", counter, "ERC20 pairs");
            console.log("Win Count:", winCount);

            mainAcctBalance = toBN(await web3.eth.getBalance(mainAcct));
            contractBalance = toBN(await web3.eth.getBalance(aaContractAddress));

            console.log("Total Current Balance:", fromWei(mainAcctBalance.add(contractBalance), 'ether'));
            // await sleep(5000);
        }
    }catch(e){
        console.log(e.toString());
    }
}

main();


