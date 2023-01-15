const Web3          = require('web3');
const web3          = new Web3('https://bsc-dataseed.binance.org/');
const errorFn       = require('./error');
const fs            = require('fs');
const ini           = require('ini');
const nodeConfig    = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
const abiArray      = JSON.parse(fs.readFileSync('./standardtoken.json', 'utf-8'));
const nodeId        = nodeConfig.node.id;
const logger        = require('../logger');
const Converter     = require('hex2dec');

module.exports = {
    getBalance : async function(address) {        
        let balance    = "";
        let returnJson = "";

        logger.withLog.info('------------------Request Data--/getBalance-');
        logger.withLog.info('address : ' + address);

        try 
        {
            balance = await web3.eth.getBalance(address);

            returnJson = {"responseCode" : "200", "balance" : web3.utils.fromWei(balance, "ether"), "nodeId":nodeId};
        }
        catch (error)
        {
            let errorCode = errorFn.returnErrorCode(error.message);
            returnJson = {"responseCode" : errorCode, "errorMsg" : error.message, "nodeId":nodeId};
        }
        
        logger.withLog.info('returnJson : ' + returnJson);
        logger.withLog.info('------------------------------------------------');
    
        return returnJson;
    },
    getTokenBalance : async function(address, contractAddress) {
        let balance     = "";
        let returnJson  = "";

        logger.withLog.info('------------------Request Data--/getTokenBalance-');
        logger.withLog.info('address : ' + address);
        logger.withLog.info('contractAddress : ' + contractAddress);

        try
        {
            let contract = new web3.eth.Contract(abiArray, contractAddress);

            balance = await contract.methods.balanceOf(address).call();
            returnJson = {"responseCode" : "200", "balance" : web3.utils.fromWei(balance, "ether"), "nodeId":nodeId};
        }
        catch (error)
        {
            let errorCode = errorFn.returnErrorCode(error.message);
            returnJson = {"responseCode" : errorCode, "errorMsg" : error.message, "nodeId":nodeId};
        }

        logger.withLog.info('returnJson : ' + returnJson);
        logger.withLog.info('------------------------------------------------');

        return returnJson;
    },
    createAccount : async function() {
        let accounts    = "";
        let returnJson  = "";

        try
        {
            accounts   = web3.eth.accounts.create();
            returnJson = {"responseCode" : "200", "address" : accounts.address, "privateKey" : accounts.privateKey, "nodeId":nodeId};
        }
        catch
        {
            let errorCode = errorFn.returnErrorCode(error.message);
            returnJson = {"responseCode" : errorCode, "errorMsg" : error.message, "nodeId":nodeId};
        }

        logger.withLog.info('------------------/createAccount-');
        logger.withLog.info('returnJson : ' + returnJson);
        logger.withLog.info('------------------------------------------------');

        return returnJson;
    },
    sendTransaction : async function(privateKey, fromAddr, toAddr, sendValue) {
        let returnJson  = "";

        logger.withLog.info('------------------Request Data--/sendTransaction-');
        logger.withLog.info('privateKey : Private');
        logger.withLog.info('fromAddr : ' + fromAddr);
        logger.withLog.info('toAddr : ' + toAddr);
        logger.withLog.info('sendValue : ' + sendValue);
        logger.withLog.info('------------------------------------------------');

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
                returnJson = {"responseCode" : "200", "TXID" : hash, "nodeId":nodeId};

                logger.withLog.info('------------------Response Data--/sendTransaction');
                logger.withLog.info(returnJson);
                logger.withLog.info('------------------------------------------------');
            });
        }
        catch (error)
        {
            let errorCode = errorFn.returnErrorCode(error.message);
            returnJson = {"responseCode" : errorCode, "errorMsg" : error.message, "nodeId":nodeId};

            logger.withLog.info('------------------Response Error Data--/getBalance');
            logger.withLog.info(returnJson);
            logger.withLog.info('--------------------------------------------');
        }
        
        
        return returnJson;
    },
    sendTokenTransaction : async function(privateKey, fromAddr, toAddr, sendValue, gasRate, contractAddress) {
        let returnJson  = "";

        logger.withLog.info('------------------Request Data--/sendTokenTransaction-');
        logger.withLog.info('privateKey : Private');
        logger.withLog.info('fromAddr : ' + fromAddr);
        logger.withLog.info('toAddr : ' + toAddr);
        logger.withLog.info('sendValue : ' + sendValue);
        logger.withLog.info('gasRate : ' + gasRate);
        logger.withLog.info('contractAddress : ' + contractAddress);
        logger.withLog.info('------------------------------------------------');

        try 
        {
            let contractABI = abiArray;
            let contract    = new web3.eth.Contract(contractABI, contractAddress, { from: fromAddr })
            let amount      = web3.utils.toHex(web3.utils.toWei(sendValue));
            let data        = contract.methods.transfer(toAddr, amount).encodeABI();
            let gasPrice    = await web3.eth.getGasPrice();            
            gasPrice        = Number(gasPrice * 21000 * gasRate);            
            gasPrice        = web3.utils.fromWei(String(gasPrice), "gwei");

            let txObj = 
            {
                gas: gasPrice,
                "to": contractAddress,
                "value": "0x00",
                "data": data,
                "from": fromAddr
            }
            let signedTx = await web3.eth.accounts.signTransaction(txObj, privateKey);
            
            await web3.eth.sendSignedTransaction(signedTx.rawTransaction, function(error, hash)
            {
                returnJson = {"responseCode" : "200", "TXID" : hash, "nodeId":nodeId};

                logger.withLog.info('------------------Response Data--/sendTokenTransaction');
                logger.withLog.info(returnJson);
                logger.withLog.info('------------------------------------------------');
            })
        }
        catch (error)
        {
            let errorCode = errorFn.returnErrorCode(error.message);
            returnJson = {"responseCode" : errorCode, "errorMsg" : error.message, "nodeId":nodeId};

            logger.withLog.error('------------------Response Error Data--/sendTokenTransaction');
            logger.withLog.error(returnJson);
            logger.withLog.error('------------------------------------------------');
        }
        
        return returnJson;
    },
    getGasPrice : async function(){
        let gasPrice   = 0;
        let returnJson = "";
        
        try
        {
            gasPrice   = await web3.eth.getGasPrice();
            gasPrice   = Number(gasPrice * 21000);
            gasPrice   = web3.utils.fromWei(String(gasPrice), "ether");
            returnJson = {"responseCode" : "200", "gasPrice" : gasPrice, "nodeId":nodeId};
        }
        catch (error)
        {
            let errorCode = errorFn.returnErrorCode(error.message);
            returnJson = {"responseCode" : errorCode, "errorMsg" : error.message, "nodeId":nodeId};
        }

        return returnJson;
    },
    latestBlockInfo : async function(){
        let returnJson      = "";
        let blockNumber     = "";
        let latestBlockInfo = "";      
        
        try
        {
            // 마지막 Block Number
            blockNumber     = await web3.eth.getBlockNumber();
            latestBlockInfo = await web3.eth.getBlock(blockNumber);
            returnJson = {"responseCode" : "200", "blockNumber" : blockNumber, "blockInfo" : latestBlockInfo, "nodeId":nodeId};
        }
        catch (error)
        {
            let errorCode = errorFn.returnErrorCode(error.message);
            returnJson = {"responseCode" : errorCode, "errorMsg" : error.message, "nodeId":nodeId};
        }

        return returnJson;
    },
    getBlockInfo : async function(blockNumber){
        let returnJson      = "";
        let blockInfo = "";      
        
        try
        {
            blockInfo = await web3.eth.getBlock(blockNumber);
            returnJson = {"responseCode" : "200", "blockNumber" : blockNumber, "blockInfo" : blockInfo, "nodeId":nodeId};
        }
        catch (error)
        {
            let errorCode = errorFn.returnErrorCode(error.message);
            returnJson = {"responseCode" : errorCode, "errorMsg" : error.message, "nodeId":nodeId};
        }

        return returnJson;
    }
    ,
    getTransactionInfo : async function(TXID){
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
                logger.withLog.info('------------------Response Data--/getTransactionInfo');
                logger.withLog.info('fromAddr : '   + txObj.from);
                logger.withLog.info('toAddr : '     + txObj.to);
                logger.withLog.info('sendValue : '  + web3.utils.fromWei(txObj.value));
                logger.withLog.info('------------------------------------------------');

                fromAddr        = txObj.from;
                toAddr          = txObj.to;
                contractAddr    = "";
                value           = web3.utils.fromWei(txObj.value);

                returnJson = {"responseCode" : "200", "fromAddr" : fromAddr, "toAddr" : toAddr, "contractAddr" : contractAddr, "value" : value ,"nodeId":nodeId};
            }
            else
            {
                returnJson = {"responseCode" : "201", "nodeId":nodeId};
            }
            // BIO BRC-20 Token
            /*
            else
            {
                console.log("BRC-20 Token Info START")
                console.log("contractAddress : " + txObj.to);
                console.log("fromAddress     : " + txObj.from);
                console.log("toAddress       : " + "0x"+txObj.input.slice(34,74));
                console.log("value           : " + web3.utils.fromWei(Converter.hexToDec(txObj.input.slice(74))));
                console.log("BRC-20 Token Info END")

                fromAddr        = txObj.from;
                toAddr          = "0x"+txObj.input.slice(34,74);
                contractAddr    = txObj.to;
                value           = web3.utils.fromWei(Converter.hexToDec(txObj.input.slice(74)));
            }
            */            
        }
        catch (error)
        {
            let errorCode = errorFn.returnErrorCode(error.message);
            returnJson = {"responseCode" : errorCode, "errorMsg" : error.message, "nodeId":nodeId};
        }

        return returnJson;
    }
    
}
