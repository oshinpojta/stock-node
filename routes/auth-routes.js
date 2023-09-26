const router = require("express").Router();
const passport = require("passport");
const userServices = require("../services/user-services");
const stockServices = require("../services/stock-services");
const userStockServices = require("../services/user-stock-services");
const jwt = require("jsonwebtoken");

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect:"/login/failed"
}))

router.get("/login/success", async (req, res) => {
    try {
        const userObj = req.user._json;
        if(userObj){
            let name = userObj.name;
            let email = userObj.email;
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
            user.picture = userObj.picture;
            res.status(200).json({
                success : true,
                message : "Logged-In Successfully!",
                user : user,
                stocks : stocks
            })
        }else{
            res.status(200).json({
                success : false,
                message : "Not Authorized!"
            })
        }
    } catch (error) {
        console.log(error);
        res.json({ success : false, msg : "Internal Server Error!" });
    }
})

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success : false,
        message : "Login Failure!"
    })
})

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get("/logout",  function (req, res) { 
    req.session = null; 
    res.clearCookie("user");
    res.clearCookie("session");
    res.clearCookie("session.sig")
    req.logout(function(err) {
        if (err) { console.log(err)}
    res.json({ success:true })});
    // res.redirect("http://localhost:3000/login")})
});

module.exports = router;


// id: '107665082023206947597',
// displayName: 'Oshin Pojta',
// name: { familyName: 'Pojta', givenName: 'Oshin' },
// emails: [ { value: 'sujanian785@gmail.com', verified: true } ],
// photos: [
//   {
//     value: 'https://lh3.googleusercontent.com/a/ACg8ocIKpiJc7DWEP5qln2uhn6in-pq5m2lR69AD-o3PSaGy5zo=s96-c'
//   }
// ],