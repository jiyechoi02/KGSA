const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

const url = process.env.DATABASE_ACCESS
// process.env.DATABASE_ACCESS

mongoose
    .connect(url, { useUnifiedTopology: true, useNewUrlParser: true})
    .then(()=>console.log("database connected.."))
    .catch(e=>{
        console.error("Connection error", e.message)
    })

const db = mongoose.connection

module.exports = db