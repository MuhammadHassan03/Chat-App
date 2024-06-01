const AsyncHandler = require("express-async-handler");
const User = require("../../models/userModel");
const Chat = require("../../models/chatModel");

const acessChat = AsyncHandler(async(req, res)=>{
    const {userId} = req.body;
    if(!userId){
        console.log("UserId not Sent in Params ")
        return res.sendStatus(400);
    }
    var isChat = await Chat.find({
        isGroupChat : false,
        $and : [
            {users : {$elemMatch: {$eq : req.user._id}}},
            {users : {$elemMatch: {$eq : userId}}},
        ]
    }).populate("users", "-password").populate("latestMessage")

    isChat = await User.populate(isChat, {
        path : "latestMessage.sender", 
        select : "name pic email",
    })

    if(isChat.length>0){
        res.send(isChat[0]);
    }
    else{
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        }
        try{
            const createdChat = await Chat.create(chatData);

            const FullChat  = await Chat.findOne({
                _id : createdChat._id
            }).populate("users", "-password");
            res.status(200).send(FullChat);
        }
        catch(error){
            res.status(400);
            throw new Error(error.message);
        }
    }
})

const fetchChat = AsyncHandler(async(req, res)=>{
    try{
        Chat.find({users:{$elemMatch:{$eq: req.user._id}}})
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        .populate("latestMessage")
        .sort({updatedAt: -1 })
        .then(async(results)=>{
            results = await User.populate(results, {
                path : "latestMessage.sender", 
                select : "name pic email",
            })
            res.status(200).send(results);
        })
    }
    catch(error){
        throw new Error(error.message);  
    }
})

const createGroupChat = AsyncHandler(async(req, res)=>{
    if(!req.body.users || !req.body.name){
        return res.status(400).send({Message : "Please Fill all the Fields"});
    }
    var users = JSON.parse(req.body.users);
    if(users.length < 2){
        return res
        .status(400)
        .send("More than two users Are required to form a group");
    }
    users.push(req.user);
    try{
        const groupChat = await Chat.create({
            chatName : req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });
        const fullGroupChat = await Chat.findOne({
            _id : groupChat._id
        })
        .populate("users", "-password")
        .populate("groupAdmin", "-password")
        res.status(200).json(fullGroupChat);
    }catch(error){
        res.status(400)
        throw new Error(error.message)
    }
})

const renameGroup = AsyncHandler(async(req, res)=>{
    console.log("Called");
    const {chatId, chatName} = req.body;
    const chatUpdated = await Chat.findByIdAndUpdate(
        chatId, 
        {
            chatName
        },
        {
            new: true,
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!chatUpdated){
        res.status(400)
        res.send("Chat Not Found")
    }
    else{
        res.json(chatUpdated)
    }
})

const addToGroup = AsyncHandler(async(req, res)=>{
    const {chatId, userId} = req.body;
    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push : {users: userId},
            
        },
        {
            new: true,
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!added){
        res.status(404)
        res.send("Chat Not Found")
    }
    else{
        res.json(added)
    }
})

const removeFromGroup = AsyncHandler(async(req, res)=>{
    const {chatId, userId} = req.body;
    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull : {users: userId},   
        },
        {
            new: true,
        }
    )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

    if(!removed){
        res.status(404)
        res.send("Chat Not Found")
    }
    else{
        res.json(removed)
    }
})

module.exports = {acessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup};