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
    Users.find({}).lean().exec((err, data) => {
        res.render("profile",{users :data})
    })
    
})

router.get("/details", protectProfile, (req, res) => {
    res.render("details")
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
    const marketcap = req.body.marketcap;
    const cmps = req.body.cmps;
    const stock = req.body.stock;
    const dy = req.body.dy;
    const roce = req.body.roce;
    const roe = req.body.roe;
    const de = req.body.de;
    const eps = req.body.eps;
    const reserves = req.body.reserves;
    const debt = req.body.debt;

    var data = {
        name: name,
        email: email,
        password: password,
        marketcap: marketcap,
        cmps: cmps,
        stock: stock,
        dy: dy,
        roce: roce,
        roe: roe,
        de: de,
        eps: eps,
        reserves: reserves,
        debt: debt
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


router.post("/details", (req, res) => {
    const email = req.body.email;
    Users.find({ email: email }).lean().exec((err, data) => {
        res.render("details", {
            user: data
        })
    })
})

router.post("/delete", (req, res) => {
    const email = req.body.email;
    Users.findOneAndDelete({ email: email }, (err, doc) => {
        if (err) throw err;
        res.redirect("/user/profile")
    });
})



router.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    Users.findOne({ email: email, password: password }).exec((err, data) => {
        if(err) throw err;
        if(data){
            req.session.userEmail = email;

            Users.find({}).lean().exec((err, data) => {
                if (err) throw err;
                // res.render("profile", {
                //     users: data
                // })
                res.redirect('/profile');
            })
            

           
        }else{
            
            res.render("login", {msg:"wrong password" });
        }
    })
})

module.exports = router;