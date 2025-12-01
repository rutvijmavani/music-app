import express from 'express'
import dotenv from 'dotenv'
import router from './route.js'

dotenv.config()

const app = express()

app.use("/api/v1" , router)

const port = process.env.PORT

app.listen(port , () => {
    console.log(`Server is running on ${port}`)
})