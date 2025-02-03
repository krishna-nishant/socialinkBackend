import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const generateToken = (userId, res) => {

    const token = jwt.sign({
        userId
    }, process.env.JWT_SECRET, {
        expiresIn: "1h"
    });

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // MS
        httpOnly: true, // cookie cannot be accessed by client side js
        sameSite: "strict", // cookie is sent only to the same domain
        secure: process.env.NODE_ENV !== "development"
    });

    return token;
}