'use strict';

let timeout = setTimeout(function it(){
    if(isExtensionExist !== undefined){
        setCreateBankHandle();
        setDepositHandler();
        setWithdrawHandler();
        loadStats();
        loadBanksHandler();    

        document.querySelector("#loadBanks").addEventListener("click", loadBanksHandler);    
    }
    else {
        timeout = setTimeout(it, 200);
    }
}, 200);


function setCreateBankHandle() {
    let form = document.querySelector("#createBank");
    form.onsubmit = function(event) {
        event.preventDefault(); 
        
        let savingFor = document.querySelector("#savingFor").value;
        let goal = document.querySelector("#goal").value;
        let deadline = document.querySelector("#deadline").value;
        let burn = document.querySelector("#burn").checked;

        goal = convertNasToWei(goal);
        deadline = convertScreenDateToUnixStamp(deadline);
        createBank(savingFor, goal, burn, deadline);
        $("#createBankModal").modal('hide');
    };
}

function loadStats() {
    let container = document.querySelector(".main-container");
    let div = document.createElement('div');
    div.innerHTML = `<div class="stats">
                        <span class="total-users">0</span> users created <span class="total-banks">0</span> piggy banks 
                        <span class="total-broken">0</span>of which were broken and <span class="total-burned">0</span> piggy banks were burned
                    <div>`;
    container.insertAdjacentElement('afterbegin', div.firstChild);

    getTotalUsers((resp) => { setInnerHtml(".total-users", resp);});
    getTotalBanks((resp) => { setInnerHtml(".total-banks", resp);});
    getBurnedBanksCount((resp) => { setInnerHtml(".total-burned", resp);});
    getBrokenBanksCount((resp) => { setInnerHtml(".total-broken", resp);});

    function setInnerHtml(selector, resp) {
        if(resp && resp.result) {
            container.querySelector(selector).innerHTML = JSON.parse(resp.result);
        }
    }
    
}

function loadBanksHandler() {
    let input = document.querySelector(".myBanksForm input");
    let wallet = input.value;
    if(!wallet) {
        wallet = localStorage.getItem("wallet");
        input.value = wallet;
    }
    else {
        localStorage.setItem("wallet", wallet);
    }

    if(wallet){
        showLoadingAnimation();
        getUserBanks(wallet, function(resp){
            if(resp){
                let result = JSON.parse(resp.result);
                clearBanks();
                if(!result || result.length == 0) {                        
                    showNoBanks();
                    return;
                }

                for (const bank of result) {
                    addDank(bank);
                }
            }             
        });
    }
}

function clearBanks() {
    document.querySelector(".banks-container").innerHTML = "";
}

function showNoBanks() {
    let container = document.querySelector(".banks-container");
    container.innerHTML = '<div class="stub no-banks">Piggy banks not found. Create your first!</div>';
}

function addDank(bank) { 
    let container = document.querySelector(".banks-container");
    let div = document.createElement('div');
    let hasDeadline = bank.deadline != "NaN" && !!bank.deadline;
    let hasBurn = !!bank.burn;
    let canWithdraw = !hasBurn;
    if(hasDeadline && bank.deadline > Date.now()) {
        canWithdraw = false;
    }

    let innerHtml = `<div class="card bank">
                        <div class="card-header d-flex justify-content-between text-muted">
                            <span>Created: ${convertUnixStampToScreenDate(bank.creation)}</span>`;

    let progress = parseFloat((convertWeiToNas(+bank.collected) / convertWeiToNas(+bank.goal) * 100).toFixed(2)); 

    if(progress == Infinity) {
        progress = 0;
    }
        

    if(hasDeadline){
        innerHtml += `<span>Deadline: ${convertUnixStampToScreenDate(bank.deadline)}</span>`;
    }
    innerHtml +=  `</div><div class="card-body"><h5 class="card-title text-center">`;
    
    if(hasBurn) {
        innerHtml +=  `<span class="flame" data-toggle="tooltip" data-placement="top" title="If you do not fulfill the goal your money will burn."></span>`;
    }

    innerHtml +=  `${bank.savingFor}</h5>
                            <div class="progress">
                                <div class="progress-bar progress-bar-striped bg-info" role="progressbar" style="width: ${progress}%;" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                                <span>${progress}%</span>
                            </div>
                            <div class="text-center">
                                ${convertWeiToNas(bank.collected)} / ${convertWeiToNas(bank.goal)} NAS
                            </div>
                            <div class="bank-controls">
                                <button class="btn btn-bank deposit" data-toggle="modal" data-target="#depositModal" data-bank-id="${bank.id}">Deposit</button>`;
    if(canWithdraw) {
        innerHtml += ` <button  class="btn btn-bank withdraw" data-toggle="modal" data-target="#withdrawModal" data-bank-id="${bank.id}">Break up</button>`;
    }
    
    innerHtml += `</div></div></div>`;

    div.innerHTML = innerHtml;
    container.append(div.firstChild);
}


function setDepositHandler() {
    let form = document.querySelector("#depositForm");
    form.onsubmit = function(event) {
        event.preventDefault();

        let amount = +document.querySelector("#depositAmount").value;
        let bankId = form.querySelector("#bankId").value;
        if(!bankId) {
            showMessage({type: "error", message: "Unknow bank Id."})
        }

        if(amount > 0) {
            makeDeposit(bankId, amount, function(response) {
                console.log(response);
            });
        }
        else {
            showMessage({type: "error", message: "Deposit amount must be more than 0."})
        }

        $("#depositModal").modal('hide');
    };
}

function showMessage(type, message) {

}

function setWithdrawHandler() {
    let modal = document.querySelector("#withdrawModal");
    modal.querySelector("#confirmWithdraw").addEventListener("click", function() {        
        let bankId = modal.querySelector("#bankId").value;
        if(!bankId) {
            showMessage({type: "error", message: "Unknow bank Id."})
        }

        makeWithdraw(bankId, function(response){

        });
        $(modal).modal('hide');
    });
}

function convertUnixStampToScreenDate(unixstamp) {
    let date = new Date(+unixstamp);
    return addZeroIfOneCharacter(date.getDate()) + "." + addZeroIfOneCharacter(date.getMonth()) + "." + date.getFullYear();
}

function convertScreenDateToUnixStamp(date) {
    //format: 22.04.1999
    let pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
    let dt = new Date(date.replace(pattern,'$3-$2-$1'));
    return +dt;
}

function addZeroIfOneCharacter(value) {
    let str = value.toString();
    return str.length == 1 ? "0" + str : str;
}

const weiAtNas = new BigNumber(1000000000000000000);

function convertWeiToNas(value) {
    return new BigNumber(value).dividedBy(weiAtNas).toNumber();
}

function convertNasToWei(value) {
    return new BigNumber(value).multipliedBy(weiAtNas).toNumber();
}

function showLoadingAnimation() {
    clearBanks();
    document.querySelector(".banks-container").innerHTML = ` <div class="spinner">
                                                                <div class="rect1"></div>
                                                                <div class="rect2"></div>
                                                                <div class="rect3"></div>
                                                                <div class="rect4"></div>
                                                                <div class="rect5"></div>
                                                            </div>`;
}



