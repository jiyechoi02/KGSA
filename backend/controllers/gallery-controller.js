const Gallery = require('../models/gallery-model')
const fs = require('fs')
const {unlinkFiles,encodeFiles} = require('../services/upload-helper')
const {s3UploadFile, s3GetFileStream, s3DeleteFile } = require('../services/aws-s3-helper')
var ObjectId = require('mongodb').ObjectID;

const createGallery = async (req,res)=>{
    const files = req.files;
    const body = req.body;
    

    if(!files){
        return res.status(400).json({
            success : false,
            error : "no files included",
        })
    }

    if(!body){
        return res.status(400).json({
            success: false,
            error : "No body included"
        })
    }
    
    var promises = []
    for(var i=0; i<files.length; i++){
        // console.log(files[i])
        promises.push(s3UploadFile(files[i]))
    }
    Promise.all(promises)
    .then(result=>{
        const urls = []
        const keys = []
        for (var i = 0; i<result.length; i++){
            urls.push(result[i].Location)
            keys.push(result[i].Key)
        }
        // console.log(keys)
        const gallery = new Gallery({
            name: body.name,
            caption : body.caption,
            imgCollection : { urls : urls, keys : keys}
        });
        
        gallery.save()
        .then(result=>{
            return res.status(201).json({
                success : true,
                data:result,
                message : "succeed to upload the image"
            })
        })
        .catch(error =>{
            return res.status(400).json({
                error,
                message : 'gallery not created!',
            })
        })

    }).then(()=>{
        unlinkFiles(files)
    })    

 
}


const getFiles = async (req, res)=>{
    try{
        const result = await Gallery.find()
     
        res.status(200).json({
            success : true,
            data : result
        })
        // for(var i = 0; i<result.length; i++){

        //     let obj = result[i]
        //     let keys = obj.imgCollection
        //     let urls = obj.imgCollection
        //     for(var i=0; i<keys.length; i++){
                
        //     }
        // }
    }catch(e){
        return res.status(500).json({
            success : false,
            error : e
        })
    }
}

const getOneFile = async (req,res)=>{
    const _id = req.params._id
    try{
        const result = await Gallery.find({_id: ObjectId(_id)})
        res.status(200).json({
            success : true,
            data : result
        })
        
    }catch(e){
        return res.status(500).json({
            success : false,
            error : e
        }) 
    }
}

const deleteOneFile = async (req,res)=>{
    const _id = req.params._id
    if(!req.body){
        return res.status(400).json({
            success: false,
            error : "No body included"
        })
    }

    Gallery.findOneAndDelete({_id: ObjectId(_id)})
    .then(result=>{
        var promises = []
        for(let i =0; i<result.imgCollection.keys.length; i++){
            const promise = s3DeleteFile(result.imgCollection.keys[i])
            promises.push(promise)
        }
        Promise.all(promises)
        .then(response=>{
            return res.status(200).json({
                success : true,
                data : response
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message : 'gallery not created!',
            })
        })
    })
    .catch(error => {
        return res.status(400).json({
            error,
            message : 'gallery not created!',
        })
    })
}


module.exports = {
    createGallery,
    getFiles,
    getOneFile,
    deleteOneFile
}