const express = require("express");
const router = express.Router();
const Users = require("../models/user.model");

const protectAdmin = (req, res, next) => {
    if(!req.session.username){
        res.redirect("/admin/login")
    }else{
        next();
    }
}

const username = "admin"
const password = "admin"




router.get("/login",(req,res) => {
    if(!req.session.username){
        res.render("admin")
    }else{
        res.redirect("/admin/dashboard")
    }
}) 
router.post("/login",(req, res) => {
    if(username === req.body.username && password === req.body.password) {
        req.session.username = username;
        res.redirect("/admin/dashboard")
    }else{
res.render("admin" , {msg: "wrong password"})
    }
})

router.get("/dashboard", (req,res) => {
    if(req.session.username){
        Users.find({}).lean().exec((err, data) => {
            if(err) throw err;
            res.render("dashboard", {
                users: data
            })
        })
    }else{
        res.redirect("/admin")
    }
  
})


router.get("/delete",(req,res) => {
    res.render("delete")
}) 


router.post("/edit", (req, res) => {
    const email = req.body.email;
    Users.find({email: email}).lean().exec((err, data) => {
        res.render("edit", {
            user: data
        })
    })
})

router.post("/editsave",(req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    const data = {
        name,
        email,
        password
    }

    Users.findOneAndUpdate({ email: email}, data, (err, doc) => {
        if(err) throw err;
        res.redirect("/admin/dashboard");
    });
})


router.post("/delete", (req, res) => {
    const email = req.body.email;
    Users.findOneAndDelete({email: email}, (err, doc) => {
        if(err) throw err;
        res.redirect("/admin/dashboard")
    });
})


router.get("/logout", (req, res) => {
    res.clearCookie("ssid");
    res.redirect("login");
})

module.exports = router;