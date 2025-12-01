import express from "express";
import dotenv from "dotenv"
import { sql } from "./config/db.js";
import adminRoutes from "./route.js";
import cloudinary from 'cloudinary'
import redis from 'redis'
import cors from 'cors'

dotenv.config()

export const redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD as string,
    socket: {
        host: "redis-16434.c8.us-east-1-3.ec2.cloud.redislabs.com",
        port: 16434
    }
})

redisClient
    .connect()
    .then(() => console.log("Connedted to redis"))
    .catch(console.error)

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME as string,
    api_key: process.env.CLOUD_API_KEY as string,
    api_secret: process.env.CLOUD_API_SECRET as string
})

const app = express()

app.use(cors())

app.use(express.json())

async function initDB() {
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS albums(
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                thumbnail VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `

        await sql`
            CREATE TABLE IF NOT EXISTS songs(
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                thumbnail VARCHAR(255),
                audio VARCHAR(255) NOT NULL,
                album_id INTEGER REFERENCES albums(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `

        console.log('Database initialized successfully') 

    } catch (error) {
        console.log("Error initDB ", error )
    }
}

app.use("/api/v1" , adminRoutes)

const port = process.env.PORT

initDB().then(() => {
    app.listen(port , () => {
        console.log(`Server is running on port ${port}`)
    })
})

// npx neonctl@latest init