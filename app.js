const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const morgan = require("morgan");
const PORT = process.env.PORT || 4000;

//initializing __filename && __function && __line - globally for ERROR logs
Object.defineProperty(global, '__stack', {
    get: function() {
        var orig = Error.prepareStackTrace;
        Error.prepareStackTrace = function(_, stack) {
            return stack;
        };
        var err = new Error;
        Error.captureStackTrace(err, arguments.callee);
        var stack = err.stack;
        Error.prepareStackTrace = orig;
        return stack;
    }
});
    
Object.defineProperty(global, '__line', {
get: function() {
        return __stack[1].getLineNumber();
    }
});
    
Object.defineProperty(global, '__function', {
get: function() {
        return __stack[1].getFunctionName();
    }
});

//creating access.log file for logging API calls
const accessLogStream = fs.createWriteStream(
    path.join(__dirname,"access.log"),
    {flags : "a"}
);


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("combined", { stream : accessLogStream}));







app.listen(PORT, () => {
    console.log(`Server started listening @ PORT ${PORT}`)
})