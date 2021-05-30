
const hex2ascii = require('hex2ascii');

class Block{


    constructor(data){
		this.hash = null;                                          
		this.height = 0;                                            
		this.body = Buffer(JSON.stringify(data)).toString('hex');   
		this.time = 0;                                              
		this.previousBlockHash = null;                              
    }


validate(){

    let self = this;

}


getBData(){

    let self = this;


    let self = this;
        return new Promise(async (resolve, reject) => {
            if (self.height == 0) {
                resolve("This is the Genesis Block");
            }
          
            let DataEncoded= this.body;
           
            let decodedData = hex2ascii(DataEncoded);
           
            let dataObject = JSON.parse(decodedData);
           
            if (dataObject) {
                resolve(dataObject);
            } else {
                reject(Error("The Block has no data."))
            }
        });
    }


}

module.exports.Block = Block; 


