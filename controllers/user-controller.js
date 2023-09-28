const path = require("path")
const userServices = require("../services/user-services");
const stockServices = require("../services/stock-services");
const userStockServices = require("../services/user-stock-services");
const jwt = require("jsonwebtoken");

const { getGoogleTokens, getGoogleUser } = require("../utils/google-utils");

exports.loginUser = async (req, res, next) => {
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
        res.cookie("user", JSON.stringify(user), {
            maxAge : 900000, //15 mins
            // httpOnly : true,
            // domain : "localhost",
            // path : "/",
            // sameSite : "strict",
            // secure : false
        });
        res.cookie("googleAuth", "false", {
            maxAge : 900000, //15 mins
            // httpOnly : true,
            // domain : "localhost",
            // path : "/",
            // sameSite : "strict",
            // secure : false
        })
        res.status(200).send({ success : true });
    } catch (error) {
        console.log(`ERROR : ${path.basename(__dirname)}/${path.basename(__filename)}/${__function}\n`,error);
        res.status(500).json({ success : false, msg : "Internal Server Error!" });
    }
}

exports.getUserStocks = async (req, res, next) => {
    try {
        let user = req.user;
        let userStocks = await userStockServices.getUserStocksByUserId(user.id);
        let stocks = stockServices.getStocks();
        stocks = stocks.map((stock) => {
            let isStock = userStocks.filter(item => item.stock_id == stock.id);
            stock.is_subscribed = isStock.length>0 ? true : false;
            return stock;
        })
        res.json({ success : true, data : stocks })
    } catch (error) {
        console.log(`ERROR : ${path.basename(__dirname)}/${path.basename(__filename)}/${__function}\n`,error);
        res.status(500).json({ success : false, msg : "Internal Server Error!" });
    }
}

exports.handleGoogleCallback = async (req, res) => {
    try {
        // get code from query-string
        const query = req.query;
        const code = query.code;
        const googleResult = await getGoogleTokens(code);

        if(!googleResult){
            console.log("googleResult", googleResult.response.data.error);

            res.status(404).json({ success : false, msg : "No Google User Found!" });
            return;
        }
        
        const { id_token, access_token } = googleResult;
        
        // get id and access-token 
        // const googleUser = jwt.decode(id_token);
        const googleUser = await getGoogleUser(id_token, access_token);

        // add to DB if not exist else create jwt
        let user = await userServices.getUserByEmail(googleUser.email);
        if(!user){
            user = await userServices.saveUser(googleUser.name, googleUser.email);
        }

        // sign our JWT
        let token = jwt.sign({ user_id : user.id, created_at : new Date().getTime() }, process.env.JWT_SECRET, { expiresIn: "1d" })
        user = await userServices.setTokenByUserId(user.id, token);
        user.created_at = new Date().getTime();
        
        user.picture = googleUser.picture;
        // set-cookies

        res.cookie("user", JSON.stringify(user),{
            maxAge : 900000*4*24, //15mins*1hr *24
            httpOnly : true,
            domain : "onrender.com",
            path : "/",
            // sameSite : "strict",
            secure : true
        });
        res.cookie("googleAuth", "true", {
            maxAge : 900000*4*24, //15mins*1hr *24
            httpOnly : true,
            domain : "onrender.com",
            path : "/",
            // sameSite : "strict",
            secure : true
        })
        res.redirect(process.env.CLIENT_URL);

    } catch (error) {
        console.log(`ERROR : ${path.basename(__dirname)}/${path.basename(__filename)}/${__function}\n`,error);
        res.status(500).json({ success : false, msg : "Internal Server Error!" });
    }
}

exports.logoutUser = async (req, res, next) => {
    try {
        const user_id = req.user;
        await userServices.setTokenByUserId(user_id, null);
        res.json({ success : true })
    } catch (error) {
        console.log(`ERROR : ${path.basename(__dirname)}/${path.basename(__filename)}/${__function}\n`,error);
        res.status(500).json({ success : false, msg : "Internal Server Error!" });
    }
}

// Google Data
// {
//     id: '107665082023206947597',
//     email: 'sujanian785@gmail.com',
//     verified_email: true,
//     name: 'Oshin Pojta',
//     given_name: 'Oshin',
//     family_name: 'Pojta',
//     picture: 'https://lh3.googleusercontent.com/a/ACg8ocIKpiJc7DWEP5qln2uhn6in-pq5m2lR69AD-o3PSaGy5zo=s96-c',  
//     locale: 'en'
//   }