const User = require('../models/user-model')
const Comment = require('../models/comment-model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const createAccount = async (req,res) =>{
    if(!req.body){
        return res.status(400).json({
            success: false,
            error : "User-controller : no body sent ",
        })
    }

    const user = new User(req.body);
    // // console.log(user)
    if(!user){
        return res.status(401).json({
            success: false,
            error : "User-controller : could not create user model"
        })
    }

    user.hash_password = bcrypt.hashSync(req.body.password, 10);
    user.save()
    .then((result)=>{
        return res.status(201).json({
            success: true,
            data : result,
            message : "User-controller : succeed to create a user account"
        })
    })
    .catch(e =>{
        return res.status(500).json({
            success: false,
            error : "User-controller : error occurred" + e
        
    })})
}
const comparePws = async (req,res)=>{
    const username = req.params.username;
    // console.log(req.body)
    if(!req.body){
        return res.status(400).json({
            success: false,
            error : "User-controller : no body sent ",
        })
    }
    let user = new Object()
    
    try{
        user = await User.findOne({
            username: username
        })
    }catch(e){
        return res.status(400).json({
            success: false,
            err : e,
        }) 
    }

    if(!user){
        return res.status(500).json({
        success : false,
        message : "Authenication failed. No username found"})
    }
    var valid = false;
    try{
        valid = await bcrypt.compare(req.body.password, user.hash_password);
    }catch(e){
        return res.status(500).json({
            err: e,
            success: false,
        })
    }
    if(!valid){
        return res.status(500).json({
            success : false,
            message : "Authenication failed. Invalid user or password."
        })    
    }else{
        return (res.status(200).json({ 
            success : true,
            data : user,
            token: jwt.sign({ 
            firstName : user.firstname, 
            lastName: user.lastname, 
            username : user.username,
            email : user.email,
            phone: user.phone_number, 
        }, 'RESTFULAPIs')}))
    }

}
const findUsername = (req,res)=>{
    const username = req.params.username;
    User.find({username : username})
    .then(result=>{
        return (res.status(200).json({ 
            success : true,
            data : result,
            message : "succeeded"
        }))
    })
    .catch(e=>{
        return res.status(500).json({
            err : e,
            success : false,
        })
    })
}

const login = async (req,res)=>{
    if(!req.body){
        return res.status(400).json({
            success: false,
            message : "Admin-controller : no body included"
        })
    }
    
    const body = req.body;
    
    if(!body.username){
        return res.status(400).json({
            success: false,
            message : "Admin-controller : no username included"
        })       
    }

    let user = new Object()

    try{
        user = await User.findOne({
            username: body.username
        })
    }catch(e){
        return res.status(400).json({
            success: false,
            err : encodeURIComponent
        }) 
    }
    if(!user){
        return res.status(500).json({
        success : false,
        message : "Authenication failed. No username found"})
    }

    var valid = false;
    try{
        valid = await bcrypt.compare(body.password, user.hash_password);
    }catch(e){
        return res.status(500).json({
            err: e,
            success: false,
        })
    }


    if(!valid){
        return res.status(500).json({
            success : false,
            message : "Authenication failed. Invalid user or password."
        })    
    }else{
        return res.status(200).json({ 
            data : user,
            success : true,
            token: jwt.sign({ 
            firstName : user.firstname, 
            lastName: user.lastname, 
            username : user.username,
            email : user.email,
            phone: user.phone_number, 
        }, 'RESTFULAPIs')});
    }
}

const updateUser = (req,res)=>{
    const username = req.params.username;
    // const _id = req.params._id;

    if(!req.body){
        return res.status(400).json({
            success: false,
            message: "no body included"
        })
    }

    User.findOneAndUpdate({ username: username }, req.body)
    .then(result=>{
        return res.status(200).json({
            success : true,
            message : "updated the account",
            data : result
        })
    })
    .catch(e =>{
        return res.status(500).json({
            success : false,
            err : e
        })
    })
}

const deleteUser = (req,res)=>{
    const username = req.params.username;
    const firstname = req.params.firstname;

    User.deleteOne({ username:username, firstname:firstname})
    .then(result=>{
        return res.status(200).json({
            success: true,
            message : "deleted the account",
            data : result
        })
    })
    .catch(e =>{
        return res.status(500).json({
            success : false,
            err : e
        })
    })
}


const getCommentByUser = async (req,res)=>{
    const username = req.params.username;
    try{
        const result = await Comment.find({username : username }).sort({"createdAt":-1})
        return res.status(200).json({
            success : true,
            data : result 
        })
    }catch(e){
        return res.status(500).json({
            success : false,
            err : e,
        })
    }
}
module.exports ={
    createAccount,
    findUsername,
    login,
    updateUser,
    deleteUser,
    comparePws,
    getCommentByUser,
}