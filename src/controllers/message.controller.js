import User from "../models/user.model.js"
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js"

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id

        // Get all users except the logged in user
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")

        res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data:filteredUsers
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in getUsersForSidebar -> " + error.message
        })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params
        const myId = req.user._id

        // Get all messages where the senderId is the logged in user and the receiverId is the user to chat with, or vice versa
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })

        res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            data: messages
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in getMessages -> " + error.message
        })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body
        const { id: receiverId } = req.params
        const senderId = req.user._id

        let imageUrl;
        if (image) {
            // Upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image)
            imageUrl = uploadResponse.secure_url
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        await newMessage.save()

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in sendMessage -> " + error.message
        })
    }
}
