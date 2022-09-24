const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Event = new Schema({
    title : {type:String, required: true},
    start : {type:Date, required: true},
    time : {type:String,required:true},
    end :  {type:Date},
    allday: { type: Boolean},
    resource : {type:String},
    location : {type:String, required:true},
}, { timestamps: true });

module.exports = mongoose.model('event', Event);
