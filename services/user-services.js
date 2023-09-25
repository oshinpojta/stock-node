const path = require("path");

const users = [
    {
        id : 1,
        name : "Oshin",
        email : "sujanian785@gmail.com",
        token : null
    }
];

exports.getUserById = async (user_id) => {
    return new Promise((resolve, reject)=>{
        try {
            for(let i=0;i<users.length;i++){
                if(users[i].id == user_id){
                    resolve(users[i]);
                    return
                }
            }
            resolve(null)
        } catch (error) {
            console.log(`ERROR : ${path.basename(__dirname)}/${path.basename(__filename)}/${__function}\n`,error);
            resolve(null);
        }
    })
}


exports.getUserByEmail = async (email) => {
    return new Promise((resolve, reject)=>{
        try {
            for(let i=0;i<users.length;i++){
                if(users[i].email == email){
                    resolve(users[i]);
                    return
                }
            }
            resolve(null)
        } catch (error) {
            console.log(`ERROR : ${path.basename(__dirname)}/${path.basename(__filename)}/${__function}\n`,error);
            resolve(null);
        }
    })
}

exports.saveUser = async (name, email) => {
    return new Promise((resolve, reject)=>{
        try {
            let user = {
                id : users.length+1,
                name : name,
                email : email,
                token : null
            }
            users.push(user)
            resolve(user)
        } catch (error) {
            console.log(`ERROR : ${path.basename(__dirname)}/${path.basename(__filename)}/${__function}\n`,error);
            resolve(null);
        }
    })
}

exports.setTokenByUserId = async (user_id, token) => {
    return new Promise((resolve, reject)=>{
        try {
            let user = null;
            for(let i=0;i<users.length;i++){
                if(users[i].id == user_id){
                    users[i].token = token;
                    user = users[i];
                    break;
                }
            }
            resolve(user);
        } catch (error) {
            console.log(`ERROR : ${path.basename(__dirname)}/${path.basename(__filename)}/${__function}\n`,error);
            resolve(null);
        }
    })
}