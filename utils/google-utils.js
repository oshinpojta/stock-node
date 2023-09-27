const axios = require("axios");
const path = require("path")
const jwt = require("jsonwebtoken");
const qs = require("querystring");

exports.getGoogleTokens = async (code) => {
    return new Promise(async (resolve, reject)=>{
        try {
            const url = "https://oauth2.googleapis.com/token";
    
            const values = {
                code,
                client_id : process.env.GOOGLE_CLIENT_ID,
                client_secret : process.env.GOOGLE_SECRET,
                redirect_uri : process.env.GOOGLE_REDIRECT_URI,
                grant_type : "authorization_code"
            };
    
            const res = await axios.post(url, qs.stringify(values), {
                headers : {
                    "Content-Type" : "application/x-www-form-urlencoded"
                }
            })
            resolve(res.data)
    
        } catch (error) {
            console.log(`Google Auth ERROR : ${path.basename(__dirname)}/${path.basename(__filename)}/${__function}\n`,error);
            resolve(null);
        }
    
    })
}

exports.getGoogleUser = async (id_token, access_token) => {
    return new Promise(async (resolve, reject)=>{
        try {
            const url = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`;
    
            const res = await axios.get(url, {
                headers : {
                    "Authorization" : `Bearer ${id_token}`
                }
            })
            resolve(res.data)
    
        } catch (error) {
            console.log(`Google Auth ERROR : ${path.basename(__dirname)}/${path.basename(__filename)}/${__function}\n`,error);
            resolve(null);
        }
    
    })
}