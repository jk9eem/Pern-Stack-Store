import express from "express"
import helmet from "helmet"
import morgan from "morgan"
import cors from "cors"
import dotenv from "dotenv"
import path from "path"

import productRoutes from "./routes/productRoutes.js"
import { sql } from "./config/db.js"
import { aj } from "./lib/arcjet.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const __dirname = path.resolve()

console.log(PORT)

// Middlewares
app.use(express.json()) // Extract the data
app.use(cors()) // Prevent the cors errors
app.use(helmet({
    contentSecurityPolicy: false,
})) // Security middleware - protect the app by HTTP headers
app.use(morgan("dev")) // Log the requests

// Applying Arcjet
app.use(async (req, res, next) => {
    try {
        const decision = await aj.protect(req, {
            requested: 1
        })
        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                res.status(429).json({error:"Too Many Requests"})
            }
            else if(decision.reason.isBot()){
                res.status(403).json({error:"Bot Access Detected"})
            }
            else{
                res.status(403).json({error:"Forbidden"})
            }
            return
        }
        if(decision.results.some((result) => {result.reason.isBot() && result.reason.isSpoofed()})){
            res.status(403).json({error:"Spoofed Bot Detected"})
            return
        }
        next()
    } catch (error) {
        console.log("Arcjet Error", error)
        next(error)
    }
})

// Middle ware
app.use("/api/products", productRoutes)

// Switch between production mode and development mode
if (process.env.NODE_ENV === "production"){
    // Serve the react app
    app.use(express.static(path.join(__dirname,"/frontend/dist")))

    // Any route other than "api/products", run this controller function
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
    })
}

async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS products (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            `
    } catch (error) {
        console.log("Error initDB", error)
    }    
}

// app.listen(PORT, () => {
//     console.log("Server is running on port" + PORT)
// })

initDB().then(() => {
    app.listen(PORT, () => {
    console.log("Server is running on port" + PORT)
    })
});