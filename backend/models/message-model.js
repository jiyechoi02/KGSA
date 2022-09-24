const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Message = new Schema(
    {
        name: { type: String, required: true},
        email : { type: String },
        message : { type : String, required: true},
    },
    { timestamps: true },
)

module.exports = mongoose.model('Message', Message)