const jwt = require('jsonwebtoken');
const path = require("path");
const userServices = require("../services/user-services");

exports.authenticateToken = async (req, res, next) => {
    try{

        let headers = req.headers;
        let token = headers['token'];

        let jwtObj = null;
        if (token == null){
            throw "No Token Received!";
        }

        // make refresh token unique to user but dont pass user_id in it, if jwt expires search its refresh token with relevant user in dB.
        jwtObj = jwt.verify(token, process.env.JWT_SECRET);
        if(!jwtObj){
            throw "JWT Error";
        }
        req.jwtObj = jwtObj;

        const user = await userServices.getUserById(jwtObj.user_id);
        // if(user.access_token != token){
        //     throw "ERROR : Invalid Token Used!";
        // }

        if(user){
            req.user = user;
        }else{
            throw "User Not Found!";
        }
        next();
    }catch(error){
        console.log(`ERROR : ${path.basename(__dirname)}/${path.basename(__filename)}/${__function}\n`,error);
        res.status(401).json({success : false, msg : "Token or User Authentication Error! Re-Login!"});
    }
}

exports.authenticateSocket = async (obj) => {
    return new Promise(async (resolve, reject)=>{
        try{
            let token = obj.token;
            let jwtObj = null;
            if (token == null){
                throw "No Token Received!";
            }
    
            // make refresh token unique to user but dont pass user_id in it, if jwt expires search its refresh token with relevant user in dB.
            jwtObj = jwt.verify(token, process.env.JWT_SECRET);
            if(!jwtObj){
                throw "JWT Error";
            }
            const user = await userServices.getUserById(jwtObj.user_id);
            // if(user.access_token != token){
            //     throw "ERROR : Invalid Token Used!";
            // }
    
            if(user){
                resolve(user)
            }else{
                throw "User Not Found or JWT does not match!";
            }
        }catch(error){
            console.log(`ERROR : ${path.basename(__dirname)}/${path.basename(__filename)}/${__function}\n`,error);
            resolve(null)
        }
    })
}