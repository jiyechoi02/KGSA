const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    firstname : {type:String, required: true},
    lastname : {type:String, required: true},
    username : {type:String, required: true},
    hash_password : {type:String, required: true},
    email : {type:String, required: true},
    phone_number : {type:String, required: true},
    major : {type:String},  
    admin : {type: Boolean ,default : true}
}, {timestamps: true})

module.exports = mongoose.model('user',User)