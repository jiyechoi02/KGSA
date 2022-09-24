const Market = require('../models/market-model');
const Comment = require('../models/comment-model');
const {s3UploadFile, s3DeleteFile } = require('../services/aws-s3-helper')
const {unlinkFiles} = require('../services/upload-helper')

var ObjectId = require('mongodb').ObjectID;

const createPost = async (req,res) =>{
    const files = req.files;

    if(!req.body){
        return res.status(400).json({
            success : false,
            message : "No Body included"
        })
    }

    // const market = new Market(req.body);
    var obj = req.body;
    var promises = [];
    if(files.length != 0){
        for(var i=0; i<files.length; i++){
            promises.push(s3UploadFile(files[i]))
        }

        Promise.all(promises)
        .then(result=>{
            // const urls = []
            const keys = []
            for (var i = 0; i<result.length; i++){
                // urls.push(result[i].Location)
                keys.push(result[i].Key)
            }
            obj = new Object({
                ...req.body,
                keys : keys
            })

            const market = new Market(obj)

            if(!market){
                return res.status(500).json({
                    success: false,
                    message : "Failed to create new Market Schema",
                })
            }
            
            market.save()
            .then(()=>{
                unlinkFiles(files)
            })
            .then(result=>{
                return res.status(200).json({
                    success : true,
                    data : result
                })
            })
            .catch(e=>{
                return res.status(500).json({
                    success: false,
                    err : e,
                })
            })
        })
        .catch(e=>{
            return res.status(500).json({
                success: false,
                err : e,
            })
        })
    }
    else{
        const market = new Market(req.body)

        if(!market){
            return res.status(500).json({
                success: false,
                message : "Failed to create new Market Schema",
            })
        }

        market.save()
        .then(()=>{
            unlinkFiles(files)
        })
        .then(result=>{
            return res.status(200).json({
                success : true,
                data : result
            })
        })
        .catch(e=>{
            return res.status(500).json({
                success: false,
                err : e,
            })
        })
   }
}

const findAllPost = async (req,res)=>{
    try{
        const posts = await Market.find({notice: false}).sort({"createdAt":-1})
        const notices = await Market.find({notice: true}).sort({"createdAt":-1})
        return res.status(200).send({
            success : true,
            posts : posts,
            notices : notices
        })
    }catch(e){
        return res.status(500).json({
            success : false,
            err : e,
        })
    }
}

const findByUser = async (req,res) =>{
    const username = req.params.username;
    try{
        const result = await Market.find({username : username }).sort({"createdAt":-1})
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

const findOnePost = async (req,res)=>{
    const _id = req.params._id;

    try{
        const result = await Market.findById({_id : ObjectId(_id)})
        // const result = await Market.find({title : title})
        // console.log(result)
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

const updatePost = async (req,res)=>{
    const _id = req.params._id;
    const files = req.files;

    if(!req.body){
        return res.status(400).json({
            success : false,
            error : "no body included"
        })
    }

    try{
        var keys = []
        if(req.body.keys != '') keys = req.body.keys.split(',')
        req.body.keys = keys

        //async deleting files 
        if(req.body.deleted){

            let deleted = req.body.deleted.split(',')
            let promises =[]
            for(var i=0; i<deleted.length;i++){
                promises.push(s3DeleteFile(deleted[i]))
            }

            Promise.all(promises)
            
        }
        
        //if there are files to upload, should upload first 
        if(files.length != 0){

            let promises =[]

            for(var i=0; i<files.length; i++){
                promises.push(s3UploadFile(files[i]))
            }

            Promise.all(promises)
            .then(response=>{
    
                for (var i = 0; i<response.length; i++){
                    // urls.push(result[i].Location)
                    keys.push(response[i].Key)
                }
                req.body.keys = keys 
            })    
            .then(()=>{
                unlinkFiles(files)
            })
            .then(async()=>{
                const result = await Market.findOneAndUpdate({_id: ObjectId(_id)}, req.body);

                return res.status(200).json({
                    success: true,
                    data :result
                })
            })
            
        }else{
            const result = await Market.findOneAndUpdate({_id: ObjectId(_id)}, req.body);

            return res.status(200).json({
                success: true,
                data :result
            })
        }

    }catch(e){
        return res.status(500).json({
            success : false,
            err : e,
        })
    }
}

const deletePost = async (req,res)=>{
    const _id = req.params._id;
    const username = req.params.username;


    Market.findOneAndDelete({_id: ObjectId(_id), username : username})
    .then(result=>{

        const comments = result.comments
        const fileKeys = result.keys? result.keys : [];

        // delete Comments refered to this post 
        if(comments.length >0){
            var promises = []
            for(let i =0; i<comments.length ; i++){
                promises.push(Comment.findOneAndDelete({_id: ObjectId(comments[i])}))   
            }

            Promise.all(promises)
        }

        //delete objects refered to this post 
        if(fileKeys.length>0){
            var promises = []
            for(let i =0; i<fileKeys.length ; i++){
                promises.push(s3DeleteFile(fileKeys[i]))   
            }

            Promise.all(promises)
        }

        return res.status(200).json({
            success : true,
            message : "succeeded deleted the post",
            data :result
        })

    })
    .catch(e=>{
        return res.status(500).json({
            success : false,
            err : e,
        })
    })

}

const deleteFile = (req,res)=>{
    const _id = req.params._id;
    const key = req.params.key;

    Market.findOneAndUpdate({_id: ObjectId(_id)}, req.body)
    .then(result=>{
        s3DeleteFile(key)
        .then(result=>{
            return res.status(200).json({
                success: true,
                data : result
            })
        })
    }).catch(e=>{
        return res.status(500).json({
            success: false,
            err : e
        })
    })
    
}
// const deleteAllByUser = async (req,res)=>{
//     const ids = req.body.ids;
//     const promises = [];

//     try{
//         for(var i = 0; i < ids.lenth(); i++){
//             promises.push()
//         }
//         const result = await Market.deleteMany({ username : username});
//         return res.status(200).json({
//             success : true,
//             message : "succeeded deleted the post",
//             result : result
//         })

//     }catch(e){
//         return res.status(500).json({
//             success : false,
//             err : e,
//         })
//     }
// }

const deleteAllPost = async (req,res)=>{
    try{
        const result = await Market.deleteMany();
        const deletedComments = await Comment.deleteMany();
        return res.status(200).json({
            success : true,
            message : "succeeded deleted the post",
            data : result
        })

    }catch(e){
        return res.status(500).json({
            success : false,
            err : e,
        })
    }
}


const findAllComments = async (req,res)=>{
    const _id = req.params._id;
    
    try{
        const result = await Market.findById({_id : ObjectId(_id)}).populate('comments')
        const comments = result.comments
        // console.log(comments)
        // comments.push(req.body)
        // console.log(result)
        // const updated = result.save()
        return res.status(200).json({
            success : true,
            data : comments
        })
    }catch(e){
        return res.status(500).json({
            success : false,
            err : e,
        })
    }
}

const addComment = async (req,res)=>{
    const _id = req.params._id;    

    if(!req.body){
        return res.status(400).json({
            success: false,
            message: "no body included."
        })
    }

    try{
        const comment = new Comment(req.body)
        const savedComment = await comment.save()
        const result = await Market.findById({_id : ObjectId(_id)})
        result.comments.push(savedComment._id)
    
        const saved = await result.save()
        const updated = saved.populate('comments')        
        return res.status(200).json({
            success : true,
            data :updated
        })

    }catch(e){
        return res.status(500).json({
            success: false,
            err : e
        })
    }
}

const updateComment = async(req,res)=>{
    // const _id = req.params._id
    let cid = req.params._cid;

    if(!req.body){
        return res.status(400).json({
            success: false,
            message: "no body included."
        })
    }

    try{
        const comment = await Comment.findByIdAndUpdate({_id : ObjectId(cid)}, req.body)
        return res.status(200).json({
            success : true,
            data : comment
        })

    }catch(e){
        return res.status(500).json({
            success: false,
            err : e
        })
    }
}


const deleteComment = async (req,res)=>{
    const _id = req.params._id;
    const _cid = req.params._cid;
    
    try{
        const result = await Comment.findOneAndDelete({_id: ObjectId(_cid)});
        if(result){
            try{
                const market = await Market.findById({_id : ObjectId(_id)})
                market.comments.pull(_cid)
                const updated = await market.save()
                return res.status(200).json({
                    succees : true,
                    data : updated
                })
            }catch(e){
                return res.status(500).json({
                    success: false,
                    err : e
                })
            }
        }
        return res.status(200).json({
            success : true,
            message : "succeeded deleted the post",
            result : result
        })
    }catch(e){
        return res.status(500).json({
            success: false,
            err : e
        })
    }
}

// const deleteAllComments = (req,res)=>{
//     try{
//         const result = await Market
//     }
// }

const updateViews = async (req,res)=>{
    const _id = req.params._id;
    try{
        const result = await Market.findOneAndUpdate({_id : ObjectId(_id)}, {$inc: {'views' :1}})
        return res.status(200).json({
            success :true,
            data :  result
        })
    }catch(e){
        return res.status(500).json({
            success : false,
            err : e
        })
    }
}

const updateLikes = async (req,res)=>{
    const _id = req.params._id;
    const value = req.body.value

    try{
        const result = await Market.findOneAndUpdate({_id : ObjectId(_id)}, {$inc: {'likes' :value }})
        return res.status(200).json({
            succees : true,
            data : result
        })
    }catch(e){
        return res.status(500).json({
            success : false,
            err : e
        })
    }
}


module.exports = {
    createPost,
    findAllPost,
    findByUser,
    findOnePost,
    updatePost,
    deletePost,
    deleteAllPost,
    // deleteAllByUser,
    findAllComments,
    addComment,
    updateComment,
    deleteComment,
    updateViews,
    updateLikes,
}