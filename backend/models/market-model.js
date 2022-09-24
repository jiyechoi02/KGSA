const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MarketSchema = new Schema({
    title : { type: String, required : true},
    username : { type: String, required: true},
    price : {type: Number},
    contents : { type: String, required : true},
    views : {type: Number, default : 0},
    notice : {type: Boolean, default : false},
    keys : {type: Array},
    comments : [{type: Schema.Types.ObjectId, ref :'comment'}]
},{timestamps: true});


const Market = mongoose.model('market', MarketSchema);

module.exports = Market