const { mongoose, Schema } = require('mongoose');
const Event = require('../models/event-model');
var ObjectId = require('mongodb').ObjectID;

createEvent = (req,res) =>{

    if(!req.body){
        return res.status(400).json({
            success: false,
            message : "Event Controller : must include body"
        })
    }

    const event = new Event(req.body);

    if(!event){
        return res.status(400).json({
            success: false,
            message: "Event Controller : no event included "
        })
    }

    event.save()
    .then((result)=>{
            return res.status(201).json({
                success: true,
                id: event._id,
                data: result,
                message: "Event Controller : new Event created"
            })
        })
        .catch(err => {
            return res.status(400).json({
                success : false,
                error : err,
                message: "Event Controller : failed to create a new event"
            })
        })
}

getAllEvent = (req,res) =>{
    Event.find().sort({"start" :1})
    .then(data =>{
        return res.status(201).json({
            success: true,
            data: data,
            message: "Event Controller : got All event successfully."
        })
    })
    .catch(err =>{
        return res.status(400).json({
            success : false,
            error : err,
            message: "Event Controller : failed to retrieve data"
        })
    })
}

deleteEvent = (req,res)=>{
    const _id = req.body._id;
    Event.deleteOne({_id: ObjectId(_id)})
    .then(data => {
        return res.status(201).json({
            success: true,
            data: data,
            message: "Event Controller : deleted All event successfully."
        })
    })
    .catch(err =>{
        return res.status(400).json({
            success : false,
            error : error,
        })
    });
}

updateEvent = (req,res) =>{
    // console.log(req.body)
    if(!req.body){
        return res.status(400).json({
            success:false,
            message:"No request body"
        })
    }
    const _id = req.body._id;
    Event.findOneAndUpdate({_id: ObjectId(_id)},req.body)
    .then(data => {
        return res.status(201).json({
            success: true,
            data: data,
            message: "Event Controller : updated event successfully."
        })
    })
    .catch(e=>{
        return res.status(400).json({
            success: false,
            error : e
        })
    })
}

module.exports = {
    createEvent,
    getAllEvent,
    deleteEvent,
    updateEvent
} 