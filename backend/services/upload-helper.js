const multer = require('multer')
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)
const path = require('path')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, '../public/uploads');
    },
  
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
  
var upload = multer({ storage: storage })

// const upload = multer({dest: path.join('../public/uploads')})

const unlinkFiles = async (files)=>{
    for(var i = 0; i < files.length; i++){
        await unlinkFile(files[i].path)
    }
}

const encodeFiles = (data)=>{
    let buf = Buffer.from(data)
    let base64 = buf.toString('base64')
    return base64
}
module.exports = {
    upload,
    unlinkFiles,
}

