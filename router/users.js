const express = require("express");
const router = express.Router();
const Users = require("../models/user.model");


const protectProfile = (req, res, next) => {
    if(!req.session.userEmail){
        res.redirect("/login")
    }else{
        next();
    }
}

const redirecttoProfile = (req,res,next) => {
    if(req.session.userEmail) {
        res.redirect("/profile")
    }else{
        next();
    }
}

router.get("/",redirecttoProfile,(req, res) => {
    res.render("index")
})

router.get("/login",redirecttoProfile, (req, res) => {
    res.render("login")
})

router.get("/register", redirecttoProfile,(req, res) => {
    res.render("register")
})

router.get("/profile", protectProfile, (req, res) => {
    res.render("profile")
})

router.get("/logout", (req, res) => {
    res.clearCookie("sid");
    res.redirect("/login");
})

//POST

router.post("/register", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    var data = {
        name: name,
        email: email,
        password: password
    }

    Users.findOne({ email:email} , (err,docs)=> {
        if(err) throw err;
        if (docs) {
            res.render("register", {msg: "email already exist"});
        }else{
            var user = new Users(data);
            user.save();
            res.redirect("login");
        }
    })
   
})

router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    Users.findOne({ email: email, password: password }).exec((err, data) => {
        if(err) throw err;
        if(data){
            req.session.userEmail = email;
            res.redirect("/profile");
        }else{
            
            res.render("login", {msg:"wrong password" });
        }
    })
})

module.exports = router;