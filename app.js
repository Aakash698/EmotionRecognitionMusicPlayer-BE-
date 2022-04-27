var createError = require("http-errors");
var express = require("express");
var path = require("path");
require('dotenv').config()
var cookieParser = require("cookie-parser");
var fs = require('fs')
var logger = require("morgan");
var config = require("./index");
var cors = require("cors");
var authenticate = require("./middleware/authenticate.middleware");
var authRoute = require("./user/auth.route");
var userRoute = require("./user/user.route");
var faceDetRoute = require("./faceDetection/faceDet.route");
var compression = require('compression');
require("./db");
var https = require('https');
const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
  };
  

var app = express();
app.use(compression())
app.use(cors());
app.use(logger("dev"));
app.use(express.json({limit:'50mb'}));
app.use(express.urlencoded({ limit:'50mb', extended: false }));

app.use(cookieParser());
// app.use(express.static(path.join(__dirname, "public")));
app.use('/music', express.static(path.join(__dirname, "music")));

app.use('/images', express.static(path.join(__dirname, "images")));

// app.use('/images', express.static(path.join(__dirname, "images")));
app.get('/',(req,res)=>{
res.send('WORKING!!')
})
app.use("/profile", express.static(path.join(__dirname, "profileImages")));
app.use("/models", express.static(path.join(__dirname, "faceDetection/model")));
// app.use('/', (req,res,next)=>{
//   res.sendFile(path.join(__dirname, "public/index.html"))
// })
app.use("/auth", authRoute);
app.use("/user", authenticate, userRoute);
app.use("/emotion", faceDetRoute);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next({
        msg: 'Not Found',
        status: 404
    })
});

app.use(function(err, req, res, next) {
    res.status(err.status || 400).json({
        status: err.status || 400,
        msg: err.msg || err,
    });
});

// var server = https.createServer(options, app);
// server.listen(8000,'0.0.0.0', ()=>{
//     console.log('connected')
// })
app.listen(process.env.PORT||8000,'0.0.0.0' , function(err, connected) {
    if (err) console.log("error connecting to server");
    else console.log("server connected to port", 8000);
});
module.exports = app;