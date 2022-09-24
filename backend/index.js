const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const routeUrls = require('./routes/routes')
const db = require('./db')
// const config = require('./config.js')

const PORT = 3001

var corsOptions = {
    origin : "*"
}

app.use(cors(corsOptions));
app.use(express.json());
// app.use(express.static(path.join(__dirname,'../build')));


db.on('error', console.error.bind(console, 'MongoDB connection error :'))

app.use('/api', routeUrls) 
// app.get("/*", (req,res)=>{
//     res.sendFile(path.join(__dirname, '../build', 'index.html'));
// });
// console.log(process.env.NODE_ENV)

app.listen(PORT, () => 
    console.log(`server is up and running on PORT ${PORT} `)
)
