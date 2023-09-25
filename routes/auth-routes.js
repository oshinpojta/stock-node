const router = require("express").Router();
const passport = require("passport");

router.get("/google/callback", passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect:"/login/failed"
}))

router.get("/login/success", (req, res) => {
    console.log("/login/success : ", req.user);
    if(req.user){
        res.status(200).json({
            success : true,
            message : "Logged-In Successfully!",
            user : req.user
        })
    }else{
        res.status(403).json({
            success : false,
            message : "Not Authorized!"
        })
    }
})

router.get("/login/failed", (req, res) => {
    res.status(401).json({
        success : false,
        message : "Login Failure!"
    })
})

router.get("/google", passport.authenticate("google", ["profile", "email"]));

router.get("/logout", (req, res) => {
    req.logOut();
    res.redirect(process.env.CLIENT_URL);
})

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