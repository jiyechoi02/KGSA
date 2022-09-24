const User = require('../models/user-model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

async function comparePwsfunction(input_pw, db_pw){
    var valid = false;
    try{
        valid = await bcrypt.compare(req.body.password, user.hash_password);
    }catch(e){
        return res.json({
            err: e,
            success: false,
        })
    }

    return valid;
}

module.exports = {
    comparePwsfunction,
}

