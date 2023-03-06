const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
   name:{
      type: String,
      require:true
   },
   phone:{
      type:String,
      require:true
   },
   email:{
      type:String,
      require:true,
      unique:true,
   },
   course:{
      type:String,
      require:true
   },
   price:{
      type:Number,
      require:true
   },
   image:{
      type:String,
      require: true
   },
   link1:{
      type:String,
      require:true
   },
   link2:{
      type:String,
      require:true
   },
   link3:{
      type:String,
      require:true
   },
   created:{
      type:Date,
      require:true,
      default: Date.now,
   },
})

module.exports = mongoose.model("User", userSchema);