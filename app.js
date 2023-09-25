const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const morgan = require("morgan");
const cookieSession = require("cookie-session");
const passport = require("passport");
const http = require("http");
const SocketIO = require("socket.io");

const authMiddleware = require("./middlewares/authenticate");
const passportSetup = require("./utils/passport");
// const orderGenerator = require("./utils/order-generator");
const stocksArray = require("./data/stocks");
const stockServices = require("./services/stock-services");
const userStockServices = require("./services/user-stock-services");

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

const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/user-routes");

const app = express();
const server = http.createServer(app);
const io = SocketIO(server, {
    cors: {
      origin: "http://localhost:3000"
    }
  });

app.use(cookieSession({
    name:"session",
    keys:["cyberwolve"],
    maxAge:100*60*60*24
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
    credentials: true
}));
app.use(bodyParser.json());
app.use(morgan("combined", { stream : accessLogStream}));

app.use("/auth", authRoutes)
app.use("/users", userRoutes);
app.use("/", (req, res) => {
    res.json({ success : true, msg : "Server Called!" });
})

// middleware to authenticate socket-user
io.use(async (socket, next) => {
    const auth = socket.handshake.auth;
    const user = await authMiddleware.authenticateSocket(auth);
    if(!user){
        next(new Error("Please Send Valid Token!"));
    }else{
        socket.user = user;
        let userStocks = await userStockServices.getUserStocksByUserId(user.id);
        let stocks = stockServices.getStocks();
        stocks = stocks.map((stock) => {
            let isStock = userStocks.filter(item => item.stock_id == stock.id);
            stock.is_subscribed = isStock.length>0 ? true : false;
            return stock;
        })
        socket.stocks = stocks;
        next()
    }
})


io.on("connection", async (socket) => {

    // On connection, subscribe to user-topics for that SocketId
    if(socket.stocks && socket.stocks.length>0){
        const stocks = socket.stocks;
        for(let i=0;i<stocks.length;i++){
            if(stocks[i].is_subscribed){
                socket.join(`${stocks[i].name}-orders`)
            }
        }
    }

    // Consumer for different stock topics
    socket.on("subscribe", (stock, do_subscribe, callback)=>{
        const user = socket.user;
        if(do_subscribe){
            userStockServices.addUserStock(user.id, stock.id)
            socket.join(`${stock.name}-orders`)
        }else{
            userStockServices.deleteUserStock(user.id, stock.id);
            socket.leave(`${stock.name}-orders`)
        }
        if(callback){
            callback(true)
        }
    });

    socket.on("error", ()=>{
        console.log("ERRORED")
    })

    socket.on("disconnect", ()=>{
        console.log("disconnected", socket.id);
    })
})


// Stock Order Producer for different stock topics/pipelines -  Ex; IOC-orders, PNB-orders
const createOrders = () => {
    setTimeout(() => {
        for(let i=0;i<stocksArray.length;i++){
            let prevOrder = stocksArray[i].orders[stocksArray[i].orders.length-1];
            let newOrder = {
                id : stocksArray[i].orders.length+1,
                count : Math.round(Math.random()*10000),
                value : numberGenerator(prevOrder.value)
            }
            stocksArray[i].orders.push(newOrder);
            io.to(`${stocksArray[i].name}-orders`).emit("order", { id : stocksArray[i].id, orders : stocksArray[i].orders });
        }
        setTimeout(() => {
            createOrders()
        }, 1000);
    }, 1000)
}

server.listen(PORT, () => {
    console.log(`Server started listening @ PORT ${PORT}`);
    createOrders();
})


// random number generator based on prevValues for stocks
const numberGenerator = (prevValue) => {
    try{
        let change = Number(prevValue*0.1);
        let addOrSubtract = Math.round(Math.random());
        if(addOrSubtract>0){
            return Math.round(prevValue + change)
        }
        return Math.round(prevValue - change);

    }catch(error){
        console.log(`ERROR : ${path.basename(__dirname)}/${path.basename(__filename)}/${__function}\n`,error);
    }
}