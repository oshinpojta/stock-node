const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport")

// https://stackoverflow.com/questions/72375564/typeerror-req-session-regenerate-is-not-a-function-using-passport
// Error in Session Manager
passport.use(
    new GoogleStrategy({
        clientID:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_SECRET,
        callbackURL:"/auth/google/callback",
        scope:["profile", "email"]
    },
        function(accessToken, refreshToken, profile, callback){
            callback(null, profile);
        }
    )
)

passport.serializeUser((user, done)=>{
    done(null, user);
})

passport.deserializeUser((user, done)=>{
    done(null, user);
})