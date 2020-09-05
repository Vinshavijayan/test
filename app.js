const express = require("express");
const exphbs = require("express-handlebars");
const UserRouter = require("./router/users");
const AdminRouter = require("./router/admin");
const mongoose = require("mongoose");
const session = require("express-session");
const nocache = require('nocache');

const app = express();

app.use(nocache())
mongoose.connect("mongodb://localhost:27017/test_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


app.engine("handlebars", exphbs());
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use("/admin",session({
    name: "ssid",
    secret: "secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))
app.use("/",session({
    name: "sid",
    secret: "secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))



app.use("/",(req,res, next) => {
    res.set('Cache-Control', 'no-store')
    next()

})




app.use("/", UserRouter);
app.use("/admin", AdminRouter );

app.listen(3000, () => {
    console.log(`http://localhost:3000`);
})