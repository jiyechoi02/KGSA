const Admin = require('../models/admin-model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

createAccount = (req,res)=>{
    if(!req.body){
        return res.status(400).json({
            success: false,
            error : "Admin-controller : no body included.",
        })
    }

    const admin = new Admin(req.body);
    admin.hash_password = bcrypt.hashSync(req.body.password, 10);

    if(!admin){
        return res.status(400).json({
            success:false,
            error: "Admin-controller : failed to create an Admin object."
        })
    }

    admin.save()
    .then(()=>{
        return res.status(201).json({
            success: true,
            id : admin._id,
            message :"Admin-controller : succeess to create an admin account",
        })
    })
    .catch(e =>{
        return res.status(500).json({
            e,
            message: "Admin-controller : failed to created an admin account"
        })
    }
    )
}

login = ((req,res)=>{
    if(!req.body){
        return res.status(400).json({
            success: false,
            message : "Admin-controller : no body included"
        })
    }
    
    Admin.findOne({
        username : req.body.username
    }).then(user =>{
        if(!user){
            return res.json({
            validation : false,
            message : "Authenication failed. Invalid user or password."})
        }
        if(!user.comparePassword(req.body.password)){
            return res.json({
                validation : false,
                message : "Authenication failed. Invalid user or password."
            })
        }
        return res.json({ 
            user : user,
            validation : true,
            token: jwt.sign({ 
            firstName : user.firstName, 
            lastName: user.lastName, 
            username : user.username,
            email : user.email,
            phone: user.phone, 
        }, 'RESTFULAPIs')});
    })
    .catch(err=>{
        return res.status(400).json({
            err,
            message : " error to retrieve user info"
        })
    })
});

module.exports={
    createAccount,
    login
}