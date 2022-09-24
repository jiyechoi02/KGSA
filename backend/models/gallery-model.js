const mongoose = require('mongoose');
const AutoInc = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const Gallery = new Schema({
    // img:{
    //     type : String, required: true
    // }
    name : { type : String, required:true},
    caption : { type : String},
    imgCollection : { type: Object, required : true}   
   
}, { timestamps: true });

// Gallery.plugin(AutoInc, { inc_field : 'id'});
module.exports = mongoose.model('Gallery', Gallery);