const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment  = new Schema({
    username : {type: String, required: true},
    comment : {type:String, requried:true},
},{timestamps: true})

module.exports = mongoose.model('comment', Comment);
