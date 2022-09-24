const AWS = require('aws-sdk');
const dotenv = require('dotenv')
const fs = require('fs')

dotenv.config()

const region = process.env.REGION
// const token = process.env.SPACES_TOKEN
const bucket =  process.env.BUCKETNAME
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
// const endpoint = new AWS.Endpoint(process.env.SPACES_ENDPOINT);

const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey
})

const s3UploadFile = (file)=>{
    const fileStream = fs.createReadStream(file.path)
    const uploadParams = {
        Bucket : bucket,
        Body : fileStream,
        Key : file.filename
    }

    return s3.upload(uploadParams).promise()
}

const s3GetFileStream = (fileKey) =>{
    const getObjectParams = {
        Bucket : bucket,
        Key : fileKey
    }
    // return s3.getObject(getObjectParams).promise()
    return s3.getObject(getObjectParams).createReadStream()

}

const s3DeleteFile =(fileKey)=>{
    console.log("hi")

    const deleteObjectParams = {
        Bucket : bucket,
        Key : fileKey
    }
    return s3.deleteObject(deleteObjectParams).promise()
}

module.exports = {
    s3UploadFile,
    s3GetFileStream,
    s3DeleteFile
}