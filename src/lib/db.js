import mongoose from "mongoose"
import dotenv from "dotenv"
dotenv.config()

const dbUser = process.env.MONGODB_USER;
const dbPassword = process.env.MONGODB_PASSWORD;

export const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@feedbackdata.czmwps7.mongodb.net/SociaLinkReact`)
        console.log("DB connected successfully");
    } catch (error) {
        console.log(`DB connection failed -> ${error.message}`);
    }
}