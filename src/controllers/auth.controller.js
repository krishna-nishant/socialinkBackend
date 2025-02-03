import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

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

export const login = (req, res) => {
    res.send("Login route");
}

export const logout = (req, res) => {
    res.send("Logout route");
}