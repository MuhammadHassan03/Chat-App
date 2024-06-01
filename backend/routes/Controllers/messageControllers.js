const asyncHandler = require("express-async-handler");
const Message = require('../../models/messageModel');
const User = require("../../models/userModel");
const Chat = require("../../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.status(400);
    }

    try {
        let message = await Message.create({ sender: req.user._id, content, chat: chatId });

        message = await (
            await message.populate("sender", "name profilePicture")
        ).populate({
            path: "chat",
            select: "chatName isGroupChat users",
            model: "Chat",
            populate: { path: "users", select: "name email profilePicture", model: "User" },
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message,
        });
        res.json(message);
    }
    catch (error) {
        throw new Error(error.message);
    }
})

const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name picture email")
            .populate("content");
        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

module.exports = { sendMessage, allMessages };