
module.exports = {
    returnErrorCode : function(errorMsg){
        let returnErrorCode = "";
        if(errorMsg.includes("is invalid, the capitalization checksum test failed, or it's an indirect IBAN address which can't be converted."))
        {
            returnErrorCode = "1001";
        }
        else if(errorMsg.includes("too many decimal places"))
        {
            returnErrorCode = "1002";
        }
        else if(errorMsg.includes("error: err: insufficient funds for gas * price + value"))
        {
            returnErrorCode = "1003";
        }
        else if(errorMsg.includes("Transaction has been reverted by the EVM:"))
        {
            returnErrorCode = "1004";
        }
        else if(errorMsg.includes("Returned error: replacement transaction underpriced"))
        {
            returnErrorCode = "1005";
        }
        else
        {
            returnErrorCode = "9999";
        }
        

        return returnErrorCode;
    }
}