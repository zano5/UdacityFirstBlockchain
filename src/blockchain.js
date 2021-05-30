
const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./block.js');
const bitcoinMessage = require('bitcoinjs-message');

class Blockchain{



    constructor() {
        this.chain = [];
        this.height = -1;
        this.initializeChain();
    }

    _addBlock(block){

        let self = this;

        return new Promise(async (resolve, reject) => {
            
            block.height = self.height + 1;
            block.time = new Date().getTime().toString().slice(0,-3);
            if (self.chain.length > 0) {
                block.previousBlockHash = self.chain[self.height].hash;
            }
            block.hash = SHA256(JSON.stringify(block)).toString();
            self.chain.push(block);
            self.height += 1;
            
            if (self.chain[self.height] == block) {
                resolve(block);
            } else {
                reject(Error("Block was not added."));
            }
        });

    }



    requestMessageOwnershipVerification(address){


        return new Promise((resolve) => {
            resolve(address + ':' + new Date().getTime().toString().slice(0,-3) + ':starRegistry');
        });

    }


    submitStar(address, message, signature, star){

        let self = this;

        return new Promise(async (resolve, reject) => {
            let time = parseInt(message.split(':')[1]);
            let currentTime = parseInt(new Date().getTime().toString().slice(0,-3));
            if (time > currentTime - 300000) {
                if(bitcoinMessage.verify(message, address, signature)) {
                    let block = new BlockClass.Block({"owner": address, "star": star});
                    await self._addBlock(block);
                    resolve(block);
                } else {
                    reject(Error("Block message not verified."))
                }
            } else {
                reject(Error("Block was not added due to timeout."));
            }
        });


    }

    getStarsByWalletAddress (address){

        let self = this;
        let stars = [];
        return new Promise((resolve, reject) => {
            self.chain.forEach(function(block) {
                block.getBData().then(data => {
                    if (data.owner) {
                        stars.push(data);
                    }
                });
            });
            resolve(stars);
        });

    }


    validateChain() {
        let self = this;
        let errorLog = [];
        return new Promise(async (resolve, reject) => {
            if (self.height > 0) {
                for (var i = 1; i <= self.height; i++) {
                    let block = self.chain[i];
                    let validation = await block.validate();
                    if (!validation){
                        console.log("ERROR VALIDATING DATA");
                    } else if (block.previousBlockHash != self.chain[i-1].hash) {
                        console.log("ERROR WITH PREVIOUS BLOCK HASH");
                    }
                }
                if (errorLog) {
                    resolve(errorLog);
                } else {
                    resolve("Chain is valid.");
                }
            } else {
                reject(Error("Cannot validate chain.")).catch(error => {
                    console.log('caught', error.message);
                });
            }
        }).then(successfulValidation => {
            console.log(successfulValidation);
        }).catch(unsuccessfulValidation => {
            console.log(unsuccessfulValidation);
        });
    }


}


module.exports.Blockchain = Blockchain;