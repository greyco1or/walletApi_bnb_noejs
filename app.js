const express       = require('express');
const app           = express();
const comFunction   = require('./common/function');
const port          = app.listen(process.env.PORT || 3000);
const bodyParser    = require('body-parser');
const fs            = require('fs');
const ini           = require('ini');
const nodeConfig    = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));
const nodeId        = nodeConfig.node.id;

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

// echo
app.get('/echo', async function(req, res) {
    res.send({"responseCode" : "200", "nodeId":nodeId});
});

// BIO 잔액조회
app.post('/getBalance', async function(req, res) {
    let address       = "";
    let cruncyType    = "";
    let responseData  = "";

    try 
    {
        address       = req.body.address.trim();
        cruncyType    = req.body.cruncyType;
        responseData  = await comFunction.getBalance(address);
    }
    catch (error)
    {

    }
    console.log(address);
    res.send(responseData);
});

// BIO Token 잔액조회
app.post('/getTokenBalance', async function(req, res) {
    let address         = "";
    let contractAddress = "";
    let cruncyType      = "";
    let responseData    = "";

    try 
    {
        address         = req.body.address.trim();
        contractAddress = req.body.contractAddress.trim();
        cruncyType      = req.body.cruncyType;
        responseData    = await comFunction.getTokenBalance(address, contractAddress);
    }
    catch (error)
    {

    }    
    
    res.send(responseData);
});


// 계정생성
app.post('/createAccount', async function(req, res) {
    let responseData  = await comFunction.createAccount();
    
    res.send(responseData);
});

// BIO 출금
app.post('/sendTransaction', async function(req, res) {
    let paramPrivateKey = "";
    let paramfromAddr   = "";
    let paramtoAddr     = "";
    let paramsendValue  = "";
    let cruncyType      = "";    
    let responseData    = "";

    try
    {
        paramPrivateKey = req.body.privateKey.trim();
        paramfromAddr   = req.body.fromAddr.trim();
        paramtoAddr     = req.body.toAddr.trim();
        paramsendValue  = req.body.sendValue.trim();
        cruncyType      = req.body.cruncyType;
        responseData    = await comFunction.sendTransaction(paramPrivateKey, paramfromAddr, paramtoAddr, paramsendValue);
    }
    catch (error)
    {
        
    }
    
    res.send(responseData);
});

// BIO Token 출금
app.post('/sendTokenTransaction', async function(req, res) {
    let paramPrivateKey = "";
    let paramfromAddr   = "";
    let paramtoAddr     = "";
    let paramsendValue  = "";
    let cruncyType      = "";
    let gasRate         = "";
    let contractAddress = "";
    
    let responseData    = "";

    try
    {
        paramPrivateKey = req.body.privateKey.trim();
        paramfromAddr   = req.body.fromAddr.trim();
        paramtoAddr     = req.body.toAddr.trim();
        paramsendValue  = req.body.sendValue.trim();
        cruncyType      = req.body.cruncyType;
        gasRate         = req.body.gasRate;
        contractAddress = req.body.contractAddress.trim();
        
        responseData    = await comFunction.sendTokenTransaction(paramPrivateKey, paramfromAddr, paramtoAddr, paramsendValue, gasRate, contractAddress);
    }
    catch (error)
    {

    }
    
    res.send(responseData);
});

// 가스비 조회
app.post('/getGasPrice', async function(req, res) {
    let cruncyType      = req.body.cruncyType;

    let responseData    = await comFunction.getGasPrice();
    
    res.send(responseData);
});

// Latest Block 정보 조회
app.get('/latestBlockInfo', async function(req, res) {        
    let responseData    = await comFunction.latestBlockInfo();
    
    res.send(responseData);
});

// Latest Block 정보 조회
app.post('/getBlockInfo', async function(req, res) {       
    let blockNumber   = "";    
    let responseData  = "";

    try 
    {
        blockNumber          = req.body.blockNumber;
        responseData  = await comFunction.getBlockInfo(blockNumber);
    }
    catch (error)
    {
        console.log(error);
    } 
    
    res.send(responseData);
});

// Transaction 정보 조회

app.post('/getTransactionInfo', async function(req, res) {

    let TXID          = "";    
    let responseData  = "";

    try 
    {
        TXID          = req.body.TXID.trim();
        responseData  = await comFunction.getTransactionInfo(TXID);
    }
    catch (error)
    {
        console.log(error);
    } 
    
    res.send(responseData);
});

// express 서버를 실행할 때 필요한 포트 정의 및 실행 시 callback 함수를 받습니다
app.listen(port, function() {
    console.log('start! express server');
})