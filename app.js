const express = require('express')
// console.log(express)
const app = express()
const PORT =3000
const web = require('./routes/web')
const dotenv =require('dotenv')
const connectDb = require('./db/connectDb')
const cookieParser = require("cookie-parser");


//data get json
app.use(express.json())
dotenv.config()
app.use(cookieParser()); // ⭐ MOST IMPORTANT


connectDb()




//localhost:3000/api
app.use('/api',web)

//server create
app.listen(process.env.PORT,()=>{
    console.log("server start localhost:4000")
})