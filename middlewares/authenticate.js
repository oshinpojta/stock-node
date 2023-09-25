const jwt = require('jsonwebtoken');
const path = require("path");

exports.authenticateAndroidToken = async (req, res, next) => {
    try{

        let headers = req.headers;
        let token = headers['jwt'];
        let token_type = headers['type'];
        if(token_type == "web"){
            // do slicing because of double commas - '"TOKEN"'
            token = token.slice(1, token.length-1);
        }

        let jwtObj = null;
        if (token == null){
            throw "No Token Received!";
        }

        // make refresh token unique to user but dont pass user_id in it, if jwt expires search its refresh token with relevant user in dB.
        jwtObj = jwt.verify(token, process.env.JWT_TOKEN_SECRET);
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