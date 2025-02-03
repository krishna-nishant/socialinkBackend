import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt; // used cookie-parser to grab the cookie
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized -> No token provided"
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized -> Invalid token"
            })
        }

        const user = await User.findById(decoded.userId).select("-password"); // exclude password
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        }

        req.user = user;

        next();

    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Error in protected route -> " + error.message
        })

    }
}
