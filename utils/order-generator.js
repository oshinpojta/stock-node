const path = require("path");
const stocks = require("../data/stocks");

const createOrders = () => {
    setTimeout(() => {
        for(let i=0;i<stocks.length;i++){
            // console.log(stocks[i]);
            let prevOrder = stocks[i].orders[stocks[i].orders.length-1];
            let newOrder = {
                id : stocks[i].orders.length+1,
                count : Math.round(Math.random()*10000),
                value : numberGenerator(prevOrder.value)
            }
            stocks[i].orders.push(newOrder);
        }
        setTimeout(() => {
            createOrders()
        }, 1000);
    }, 1000)
}
createOrders();

const numberGenerator = (prevValue) => {
    try{
        let change = Number(prevValue*0.1);
        let addOrSubtract = Math.round(Math.random());
        if(addOrSubtract>0){
            return Math.round(prevValue + change)
        }
        return Math.round(prevValue - change);

    }catch(error){
        console.log(`ERROR : ${path.basename(__dirname)}/${path.basename(__filename)}/${__function}\n`,error);
    }
}