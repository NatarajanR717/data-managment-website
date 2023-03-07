const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();
const session = require('express-session');
const PORT = process.env.PORT || 4000;




//Database connection
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useUnifiedTopology:true});
const db = mongoose.connection;
db.on('error',(error) =>{console.log(error);});
db.once('open',()=>{console.log("connected to the database");
});

// Middlewares
const app = express();

app.use(bodyParser.json());

app.use(express.urlencoded({extended: false}));

app.use(session({
   secret:"my secret key",
   saveUninitialized:true,
   resave:false,
}));
app.use(express.static(__dirname + '/public'));



// route prefix
app.use("",require("./server/routes/routes"));

// set template engine
app.set("view engine", "ejs");

app.use("/css",express.static(path.join(__dirname,"public/css")));
app.use("/images",express.static(path.join(__dirname,"public/images")));
app.use("/js",express.static(path.join(__dirname,"public/js")));
app.use(express.static("uploads"));


app.listen(PORT,()=>{
   console.log(`Sever is now started at http://localhost:${PORT}`);
})