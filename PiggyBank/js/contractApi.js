const contractAddress = "n1zB724pvnT1nPiteFMP6XJju4322E2AzfP";
let NebPay = require("nebpay"); 
let nebPay = new NebPay();


function createBank(savingFor, goal, burn = false, deadline = "", cb) {
    let value = "0";
    let callFunction = "add";

    let callArgs = `[${Date.now()}, ${goal}, "${savingFor}", "${deadline}", ${burn}]`;
    nebPay.call(contractAddress, value, callFunction, callArgs, {  
        callback: function(resp){
            if(cb){
                cb(resp);
            }                
        }   
    });
}

function getUserBanks(wallet, cb) {
    let value = "0";
    let callFunction = "get";

    let callArgs = `["${wallet}"]`;
    nebPay.simulateCall(contractAddress, value, callFunction, callArgs, {  
        callback: function(resp){
            if(cb){
                cb(resp);
            }           
        }   
    });
}


function makeDeposit(bankId, amount, cb) {
    let value = amount.toString();
    let callFunction = "putMoney";

    let callArgs = `[${bankId}]`;
    nebPay.call(contractAddress, value, callFunction, callArgs, {  
        callback: function(resp){
            if(cb){
                cb(resp);
            }            
        }   
    });
}


function makeWithdraw(bankId, cb) {
    let value = "0";
    let callFunction = "breakup";

    let callArgs = `[${bankId}, ${Date.now()}]`;
    nebPay.call(contractAddress, value, callFunction, callArgs, {  
        callback: function(resp){
            if(cb){
                cb(resp);
            }            
        }   
    });
}


function getTotalUsers(cb) {
    let value = "0";
    let callFunction = "totalUsers";

    let callArgs = ``;
    nebPay.simulateCall(contractAddress, value, callFunction, callArgs, {  
        callback: function(resp){
            if(cb){
                cb(resp);
            }            
        }   
    });
}

function getTotalBanks(cb) {
    let value = "0";
    let callFunction = "totalBanks";

    let callArgs = ``;
    nebPay.simulateCall(contractAddress, value, callFunction, callArgs, {  
        callback: function(resp){
            if(cb){
                cb(resp);
            }            
        }   
    });
}

function getBurnedBanksCount(cb) {
    let value = "0";
    let callFunction = "totalBurned";

    let callArgs = ``;
    nebPay.simulateCall(contractAddress, value, callFunction, callArgs, {  
        callback: function(resp){
            if(cb){
                cb(resp);
            }            
        }   
    });
}

getBrokenBanksCount

function getBrokenBanksCount(cb) {
    let value = "0";
    let callFunction = "totalBroken";

    let callArgs = ``;
    nebPay.simulateCall(contractAddress, value, callFunction, callArgs, {  
        callback: function(resp){
            if(cb){
                cb(resp);
            }            
        }   
    });
}