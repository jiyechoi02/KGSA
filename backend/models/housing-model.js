const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Comment = require('./comment-model')

const HousingSchema = new Schema({
    title : { type: String, required : true},
    username : { type: String, required: true},
    price : {type: Number},
    address : {type: String},
    contents : { type: String, required : true},
    views : {type: Number, default : 0},
    notice: {type:Boolean, default: false},
    keys : {type:Array},
    comments : [{type: Schema.Types.ObjectId, ref :'comment'}]
},{timestamps: true});

const Housing = mongoose.model('housing', HousingSchema);

module.exports = Housing