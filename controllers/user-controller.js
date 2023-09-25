const path = require("path")
const userServices = require("../services/user-services");
const stockServices = require("../services/stock-services");
const userStockServices = require("../services/user-stock-services");
const jwt = require("jsonwebtoken");


// this will later be called by googleAPI
exports.getUser = async (req, res, next) => {
    try {
        let name = "Oshin";
        let email = "sujanian785@gmail.com";
        let user = await userServices.getUserByEmail(email);
        if(!user){
            user = await userServices.saveUser(name, email);
        }
        let token = jwt.sign({ user_id : user.id, created_at : new Date().getTime() }, process.env.JWT_SECRET, { expiresIn: "1d" })
        user = await userServices.setTokenByUserId(user.id, token);
        user.created_at = new Date().getTime();

        let userStocks = await userStockServices.getUserStocksByUserId(user.id);
        let stocks = stockServices.getStocks();
        stocks = stocks.map((stock) => {
            let isStock = userStocks.filter(item => item.stock_id == stock.id);
            stock.is_subscribed = isStock.length>0 ? true : false;
            return stock;
        })
        res.json({ success : true, data : { user, stocks } })
    } catch (error) {
        console.log(`ERROR : ${path.basename(__dirname)}/${path.basename(__filename)}/${__function}\n`,error);
        res.status(500).json({ success : false, msg : "Internal Server Error!" });
    }
}

exports.logoutUser = async (req, res, next) => {
    try {
        const user_id = req.user;
        await userServices.setTokenByUserId(user_id, null);

        // delete all socketIds mapped to user_id;

        res.json({ success : true })
    } catch (error) {
        console.log(`ERROR : ${path.basename(__dirname)}/${path.basename(__filename)}/${__function}\n`,error);
        res.status(500).json({ success : false, msg : "Internal Server Error!" });
    }
}
