const Web3     = require('web3');
const web3     = new Web3('https://mainnet.bitonechain.com/');
const fs       = require('fs');
const abiArray = JSON.parse(fs.readFileSync('./standardtoken.json', 'utf-8'));
const nftABI   = JSON.parse(fs.readFileSync('./NFTabi.json', 'utf-8'));
const Converter = require('hex2dec');


// ERC-20(ZBIO) : 0x2447D4440767Cd21e9D64d0c5b44D057B3701d23
// ERC-721      : 0xe4b3415066dDB94D36438A9ec956bEE8cb151cfB 
// ERC-1155     : 0x2b1e33fc426E54d016271487fCaED39bfd8bf757  -- BIO-NFT
// ERC-1155     : 0x99A1532c804aE8Fa9BE15433d486c97ea86A3f82  -- EEDEA-NFT

const latestBlockInfo = async function() {
    // 마지막 Block Number
    const blockNumber = await web3.eth.getBlockNumber();
    // console.log("The latest block number is " + blockNumber);
    // 마지막 Block Info
    let latestBlockInfo = await web3.eth.getBlock(3155945);
    console.log(latestBlockInfo.transactions);
    // let bioTx = await web3.eth.getTransaction("0x1500e0ede24827f9dd74ea7e6a74f53bd0dff2a50c3ee84945a3e7767eef8bc2");
    // let tokenTx = await web3.eth.getTransaction("0xd994920d02055e8a11c53a2a2ac904886587438a3ecea6f9374af1ec23c5c045");        
    // txObj.input == "0x" ? BIO Coin : BRC-20 TOKEN
    // console.log("BIO INFO START")
    // console.log("fromAddress : " + bioTx.from);
    // console.log("toAddress   : " + bioTx.to);
    // console.log("value       : " + web3.utils.fromWei(bioTx.value));
    // console.log("BIO INFO END\n")

    // console.log("BRC-20 Token Info START")
    // console.log("contractAddress : " + tokenTx.to);
    // console.log("fromAddress     : " + tokenTx.from);
    // console.log("toAddress       : " + "0x"+tokenTx.input.slice(34,74));
    // console.log("value           : " + web3.utils.fromWei(Converter.hexToDec(tokenTx.input.slice(74))));
    // console.log("BRC-20 Token Info END")
}

// latestBlockInfo();

const nftTransaction = async function() {
    let txObj = await web3.eth.getTransactionReceipt("0xecf10715557d7497462942c88a9ca0d5a54c7afaac1012a4a1b3f65fa7366810");
    console.log(txObj.logs)
    console.log("BRC-720 Token Info START")
    // console.log("contractAddress : " + txObj.to);
    // console.log("fromAddress     : " + txObj.from);
    // console.log("toAddress       : " + "0x"+txObj.input.slice(34,74));
    // console.log("value           : " + web3.utils.fromWei(Converter.hexToDec(txObj.input.slice(74))));
    console.log("BRC-720 Token Info END")

    // console.log("BIO INFO START")
    // console.log("fromAddress : " + txObj.from);
    // console.log("toAddress   : " + txObj.to);
    // console.log("value       : " + web3.utils.fromWei(txObj.value));
    // console.log("BIO INFO END\n")
}

// nftTransaction();

const mint = async function() {
    let tokenAddress  = "0x975e6aEc9ca639514989c4Dc3E6b8f4e05561DED";   // Token contract address
    let walletAddress = "0x31F516770b2B87aa35c149F89501c6A19164F51e";   // Wallet address
    
    let contract = new web3.eth.Contract(abiArray,tokenAddress);
    
    console.log(contract.options.address);
    
    try
    {
        // Input parameter
        // Address[], TokenID[]
        let balance = await contract.methods.mint(1).call();
        console.log(balance);
    }
    catch (error)
    {
        console.log("@@@@@@");
        console.log(error);
    }
}

const getERC1155Balance = async function() {    
    let tokenAddress  = "0x2b1e33fc426e54d016271487fcaed39bfd8bf757";   // Token contract address
    let walletAddress = "0x6e128f7dCE3C8dc084F3cFe3B3e8038cF490B68D";   // Wallet address
    
    let contract = new web3.eth.Contract(abiArray,tokenAddress);
    
    console.log(contract.methods);
    
    try
    {
        // Input parameter
        // Address[], TokenID[]
        let balance = await contract.methods.balanceOfBatch([walletAddress, walletAddress], [187, 200]).call();
        console.log(balance);
    }
    catch (error)
    {
        console.log("@@@@@@");
        console.log(error);
    }
}

// getERC1155Balance();

const test = async function() {
    let tokenAddress  = "0xb5b95e553fdace088f34a9a7728b44a4bcfc9b6e";   // Token contract address
    let walletAddress = "0xfCe5012aAF52A511Abc54FC9Fa848a06D2b915Ed";   // Wallet address
    
    console.log("111")
    let contract = new web3.eth.Contract(nftABI,tokenAddress);
    console.log("222")
    
    
    console.log("3333")
    console.log(contract.methods);
    
    try
    {
        console.log("4444")
        let balance = await contract.methods.balanceOf(walletAddress, 901).call();
        console.log(balance);
        console.log("5555")
    }
    catch (error)
    {
        console.log("@@@@@@");
        console.log(error);
    }

}

test();

const getERC721Balance = async function() {    
    let tokenAddress  = "0xe4b3415066dDB94D36438A9ec956bEE8cb151cfB";   // Token contract address
    let walletAddress = "0x51a817766d1A06f342028D6e903573d29b9aa538";   // Wallet address
    
    console.log("111")
    let contract = new web3.eth.Contract(abiArray,tokenAddress);
    console.log("222")
    
    
    console.log("3333")
    console.log(contract.methods);
    
    try
    {
        console.log("4444")
        let balance = await contract.methods.balanceOf(walletAddress).call();
        console.log(balance);
        console.log("5555")
    }
    catch (error)
    {
        console.log("@@@@@@");
        console.log(error);
    }
}

// getERC721Balance();

const sendToken = async function() {
    // 토큰 계약 주소
    let tokenAddress = "0x13b8D7dc093a65A4e38eC2be87e3a3a54Cb873f9";

    const privateKey = "0x222da31e335443a73e30831f32677f210f2dbc2dbf209e10460f2cb8121064ce";
    let fromAddress  = "0x6e128f7dCE3C8dc084F3cFe3B3e8038cF490B68D"
    let toAddress    = "0x4889Db70f244e2ffeADEB8a217b05d01528A96Af";
     
    
    let contractABI = abiArray;
    let contract    = new web3.eth.Contract(contractABI, tokenAddress, { from: fromAddress })
    let amount      = web3.utils.toHex(web3.utils.toWei("1612.90")); //1 DEMO Token    
    let data        = contract.methods.transfer(toAddress, amount).encodeABI();
    
    sendErcToken()
    function sendErcToken() {
        let txObj = {
            gas: web3.utils.toHex(100000),
            "to": tokenAddress,
            "value": "0x00",
            "data": data,
            "from": fromAddress
        }
        web3.eth.accounts.signTransaction(txObj, privateKey, (err, signedTx) => {
            if (err) {
                return callback(err)
            } else {
                console.log(signedTx)
                return web3.eth.sendSignedTransaction(signedTx.rawTransaction, (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(res)
                    }
                })
            }
        })
    }
}

const sendERC1155NFT = async function() {
    // 토큰 계약 주소
    let tokenAddress = "0x2b1e33fc426e54d016271487fcaed39bfd8bf757";

    const privateKey = "0x4594b2b27a3a6f0a5c6b2b77d0ead0650b636edd659190757dfba847fb9ea71d";
    let fromAddress  = "0x8E48F1625A6D8E981f1d8d558B4e57fA7a5B935c"
    let toAddress    = "0x116f2d29A7bE26C5F12E811eEC751438CD09A7fb";
     
    
    let contractABI = abiArray;
    let contract    = new web3.eth.Contract(contractABI, tokenAddress, { from: fromAddress });
    let gasPrice    = await web3.eth.getGasPrice();
    gasPrice   = Number(gasPrice * 21000);
    gasPrice   = web3.utils.fromWei(String(gasPrice), "ether");
    console.log(gasPrice);
    
    let data        = contract.methods.safeBatchTransferFrom(fromAddress, toAddress, [187], [1], web3.utils.toHex(web3.utils.toWei(gasPrice))).encodeABI();
    
    let gas =  await web3.eth.estimateGas({"to":toAddress, "data":data});
    console.log(gas * 5);
    sendErcToken()
    function sendErcToken() {
        let txObj = {
            "gas": gas * 5,
            "to": tokenAddress,
            "value": "0x00",
            "data": data,
            "from": fromAddress
        }
        web3.eth.accounts.signTransaction(txObj, privateKey, (err, signedTx) => {
            if (err) {
                console.log(err);
            } else {
                console.log(signedTx)
                return web3.eth.sendSignedTransaction(signedTx.rawTransaction, (err, res) => {
                    if (err) {
                        console.log(err)
                    } else {
                        console.log(res)
                    }
                })
            }
        })
    }
}

const gasTest = async function (){

    let tokenAddress = "0x99A1532c804aE8Fa9BE15433d486c97ea86A3f82";

    const privateKey = "0xe1d237dff12b68325a5026c9395ef390779a723e989c39802dacf8c49a3decb7";
    let fromAddress  = "0x31F516770b2B87aa35c149F89501c6A19164F51e"
    let toAddress    = "0x51a817766d1A06f342028D6e903573d29b9aa538";
     
    
    let contractABI = abiArray;
    let contract    = new web3.eth.Contract(contractABI, tokenAddress, { from: fromAddress });
    let gasPrice    = await web3.eth.getGasPrice();
    gasPrice   = Number(gasPrice * 21000);
    gasPrice   = web3.utils.fromWei(String(gasPrice), "ether");
    console.log(gasPrice);
    
    let data        = contract.methods.safeBatchTransferFrom(fromAddress, toAddress, [51,53], [1,1], web3.utils.toHex(web3.utils.toWei(gasPrice))).encodeABI();

    let gas =  await web3.eth.estimateGas({"to":toAddress, "data":data});
    console.log(gas);
}

const sendTransaction = async function() {

    let privateKey = "0x66eedf157ab912f60bd188184ee352d4a5135fd77a71f5e267783a39d2385f11";
    let fromAddr   = "0xBe03490A00e09EAA461A6597590dbde095D02D13";
    let toAddr     = "0x3CA7A4D0f6D326274D1284475B3c54f722203Ab9";
    let sendValue  = "5.9";
    try
        {
        let value       = await web3.utils.toWei(sendValue, 'ether')
        let gasPrice    = await web3.eth.estimateGas({ to: toAddr, from: fromAddr, value: value });

        signedTx = await web3.eth.accounts.signTransaction(
            {
                from : fromAddr,
                to   : toAddr,
                value: value,
                gas  : gasPrice
            },
            privateKey
        );
    
        await web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash)
        {
            console.log("success");
            console.log(hash);
        });
    }
    catch (error)
    {
        let errorCode = errorFn.returnErrorCode(error.message);
        
    }
}
const gasTransaction = async function (){

    let txObj = await web3.eth.getTransaction(TXID);
    
    let fromAddr      = "";
    let toAddr        = "";
    let contractAddr  = "";
    let value         = "";
    let returnJson    = "";

    try
    {
        // BIO
        if(txObj.input == "0x")
        {
            fromAddr        = txObj.from;
            toAddr          = txObj.to;
            contractAddr    = "";
            value           = web3.utils.fromWei(txObj.value);
            console.log(console +"\t"+toAddr+"\t"+value);
        }
    }
    catch (error)
    {
        let errorCode = errorFn.returnErrorCode(error.message);
        returnJson = {"responseCode" : errorCode, "errorMsg" : error.message, "nodeId":nodeId};
    }
};
// sendToken();

// sendTransaction();

// getERC1155Balance();

// sendERC1155NFT();

// sendNFT();

// gasTest();