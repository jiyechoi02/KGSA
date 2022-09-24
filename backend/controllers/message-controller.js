const emailjs = require('emailjs-com');
const Message = require('../models/message-model');
createMessage = (req, res) =>{
    const body = req.body

    if(!body) {
        return res.status(400).json({
            success:false,
            error: 'You must provide a message',
        })
    }

    const message = new Message(body)

    if(!message){
        return res.status(400).json({
            success:false,
            error: err
        })
    }

    message
        .save()
        .then((result)=>{
            return res.status(201).json({
                success:true,
                id: message._id,
                data : result,
                message : 'message created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'message not created!',
            })
        })
}

sendEmail = (req,res)=>{
    // console.log(req)
    if(!req.body){
        res.status(400).json({
            success: false,
            message: "no body sent for email"
        })
    }
    const service_id  = req.body.SERVICE_ID;
    const template_id = req.body.TEMPLATE_ID;
    const message = req.body.data;
    const user_id = req.body.USER_ID;

    emailjs.send(service_id, template_id, message, user_id)
    .then((result)=>{
        return res.status(201).json({
            success: true,
            data : result,
            message: "sent msg successfully"
        })
    })
    .catch((e)=>{
        return res.status(400).json({
            success: false,
            error: e
        })
    })
}
module.exports = {
    createMessage,
    sendEmail,
}