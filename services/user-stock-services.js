const path = require("path");

let userStocks = [
    {
        id : 1,
        user_id : 1,
        stock_id : 1
    }
];

exports.getUserStocksByUserId = async (user_id) => {
    return new Promise((resolve, reject)=>{
        try {
            let arr = [];
            for(let i=0;i<userStocks.length;i++){
                if(userStocks[i].user_id == user_id){
                    arr.push(userStocks[i])
                }
            }
            resolve(arr)
        } catch (error) {
            console.log(`ERROR : ${path.basename(__dirname)}/${path.basename(__filename)}/${__function}\n`,error);
            resolve([]);
        }
    })
}

exports.addUserStock = async (user_id, stock_id) => {
    return new Promise((resolve, reject)=>{
        try {
            let obj = {
                id : userStocks.length,
                user_id,
                stock_id
            }
            userStocks.push(obj)
            resolve(true)
        } catch (error) {
            console.log(`ERROR : ${path.basename(__dirname)}/${path.basename(__filename)}/${__function}\n`,error);
            resolve(false);
        }
    })
}

exports.deleteUserStock = async (user_id, stock_id) => {
    return new Promise((resolve, reject)=>{
        try {
            userStocks = userStocks.filter(item => item.user_id == user_id && item.stock_id == stock_id);
            resolve(true)
        } catch (error) {
            console.log(`ERROR : ${path.basename(__dirname)}/${path.basename(__filename)}/${__function}\n`,error);
            resolve(false);
        }
    })
}
