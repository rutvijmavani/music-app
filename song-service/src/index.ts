import express from 'express'
import dotenv from 'dotenv'
import router from './route.js'
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

redisClient.connect().then(() => console.log("Connedted to redis")).catch(console.error)

const app = express()

app.use(cors())

app.use("/api/v1" , router)

const port = process.env.PORT

app.listen(port , () => {
    console.log(`Server is running on ${port}`)
})