import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill in all fields"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters long"
            })
        }
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            // generate jwt token
            generateToken(newUser._id, res)
            await newUser.save()

            res.status(201).json({
                success: true,
                message: "User created successfully",
                data: newUser
            })
        } else {
            return res.status(400).json({
                success: false,
                message: "User not created"
            })
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in creating user -> " + error.message
        })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userExists = await User.findOne({ email })
        if (!userExists) {
            return res.status(400).json({
                success: false,
                message: "User does not exist"
            })
        }

        const isValidPassword = await bcrypt.compare(password, userExists.password)
        if (!isValidPassword) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            })
        }

        // generate jwt token
        generateToken(userExists._id, res)

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: userExists
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in logging in user -> " + error.message
        })
    }
}

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0
        })
        res.status(200).json({
            success: true,
            message: "User logged out successfully"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in logging out user -> " + error.message
        })
    }
}

export const updateProfile = async (req, res) => {
    try {
        const { profilePic } = req.body
        const userId = req.user._id
        if (!profilePic) {
            return res.status(400).json({
                success: false,
                message: "Please upload a profile picture"
            })
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic)

        const updatedUser = await User.findByIdAndUpdate(userId, {
            profilePic: uploadResponse.secure_url
        }, {
            new: true // return the updated user not old one
        })

        res.status(200).json({
            success: true,
            message: "Profile picture updated successfully",
            data: updatedUser
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in updating profile -> " + error.message
        })
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "User is authenticated",
            data: req.user
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in checking auth -> " + error.message
        })
    }
}