const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    marketcap: String,
    cmps: String,
    stock: String,
    dy: String,
    roce: String,
    roe: String,
    de: String,
    eps: String,
    reserves: String,
    debt: String
})

const Users = mongoose.model("User", UserSchema);
module.exports = Users;