import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.router.js"
import { connectDB } from "./lib/db.js"
import cookieParser from "cookie-parser"
import messageRoutes from "./routes/message.route.js"
import cors from "cors"

const app = express()
dotenv.config()
connectDB()

app.use(express.json())
app.use(cookieParser())
app.use(cors(
    {
        origin: "http://localhost:5173",
        credentials: true
    }
))

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})