const express = require("express");
const router = express.Router();
const axios = require("axios");
const User = require("../models/users");
const multer = require("multer");
const path = require("path");
const fs = require('fs');
// image upload
let storage = multer.diskStorage({
   destination: function(req,file,cb){
      cb(null, "./uploads");
   },
   filename: function(req,file,cb){
      cb(null, file.fieldname+"_"+Date.now()+"_"+file.originalname);
   },
});

let upload = multer({
   storage: storage,
}).single("image");


// insert user into database
router.post("/api/users",upload,(req,res) =>{
   if(!req.body){
      res.status(400).send({message: "content can not be empty"});
   }
   const user = new User({
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      course: req.body.course,
      price: req.body.price,
      image: req.file.filename,
      link1: req.body.link1,
      link2: req.body.link2,
      link3: req.body.link3, 
      created: req.body.created,
   });
   user.save(user).then(data =>{
      res.redirect('/add-user');
   }).catch(err =>{
      res.status(500).send({message: err.message || "some error occur"});
   });
});


// get all users
router.get("/api/users",(req,res) =>{
   if(req.query.id){
      const id = req.query.id;

      User.findById(id).then(data =>{
         if(!data){
            res.status(404).send({message: "Not found user with id"+id})
         }else{
            res.send(data);
         }
      }).catch(err =>{
         res.status(500).send({message: "Error retrieving user with id"+id});
      });
   } else{
      User.find().then(user =>{
         res.send(user)
      }).catch((err) =>{
         res.status(500).send({message: err.message || "Error Occured"})
      })
   }
})

// update user by user id
router.put("/api/users/:id",upload,(req,res) =>{
   if(!req.body){
      return res.status(400).send({message: "data to update can not b empty"});
   }
   let id = req.params.id;
   let imagePath = path.join(__dirname, './uploads' + req.file.filename);

    // read image file and update database record
   let newImage = fs.readFileSync(imagePath);
   User.findByIdAndUpdate(id,{
      name: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      course: req.body.course,
      price: req.body.price,
      image: newImage,
      link1: req.body.link1,
      link2: req.body.link2,
      link3: req.body.link3, 
      created: req.body.created,
   })
   .then(data =>{
      if(!data){
         res.status(404).send({message: `cannot update user with ${id}.Maybe user not found`})
      } else{
         res.send(data);
         fs.unlinkSync(imagePath);
      }
   }).catch((err) =>{
      res.status(500).send({messgae: "Error update user information"})
   })
})

// Delete the user by id
router.delete("/api/users/:id",(req,res) =>{
   const id = req.params.id;
   User.findByIdAndDelete(id).then((data) =>{
      if(!data){
         res.status(404).send({message: `can not delete with id ${id}.matbe id is wrong`});
      }else{
         res.send({message: "user deleted successfully"});
      }
   }).catch(err =>{
      res.status(500).send({message: "could not delete User with id=" +id
   });
   });
});


router.get("/",(req,res) =>{
   axios.get("http://localhost:8080/api/users").then(function(response){
      res.render("index",{title: "home page",users: response.data});
   }).catch(err =>{
      res.send(err);
   })
   
});

router.get("/add-user",(req,res) =>{
   res.render("adduser",{title: "add user"});
});

router.get("/update-user",(req,res) =>{
   axios.get('http://localhost:8080/api/users',{params: {id:req.query.id}}).then(function(userdata){
      res.render("updateuser",{title: "update user",users:userdata.data});
   }).catch(err =>{
      res.send(err);
   });
   
});

router.get("/display-user",(req,res) =>{
   axios.get('http://localhost:8080/api/users',{params: {id:req.query.id}}).then((userdata) =>{
      userdata.data.created = new Date (userdata.data.created).toLocaleDateString();
      res.render("display",{title: "Display user",users:userdata.data});
   }).catch(err =>{
      res.send(err);
   });
});
module.exports = router;


