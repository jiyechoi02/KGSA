const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const Admin = new Schema({
    firstName : {type: String, trim:true, required: true},
    lastName : {type: String, required: true},
    username : {type: String, required: true},
    hash_password : {type: String, required: true},
    email : {type: String, unique:true, lowercase:true, trim:true, required:true},
    phone : {type: Number}
},{timestamps : true})

Admin.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.hash_password);
}
module.exports = mongoose.model('admin', Admin)