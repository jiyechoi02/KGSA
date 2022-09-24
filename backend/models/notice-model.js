const mongoose = require('mongoose')
const AutoInc = require('mongoose-sequence')(mongoose);
const Schema = mongoose.Schema

const NoticeShema = new Schema({
    title : { type: String, required : true},
    username : { type: String, required: true},
    contents : { type: String, required : true},
    views : {type: Number, default : 0},
    keys : {type:Array},
    comments : [{type: Schema.Types.ObjectId, ref :'comment'}]
},{timestamps: true});

const Notice = mongoose.model('notice', NoticeShema);

// Notice.plugin(AutoInc, {inc_field:'id'});

module.exports = Notice