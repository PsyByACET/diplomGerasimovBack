const express = require("express");
const cors = require("cors")
require("dotenv").config();


const userRouter = require("./Routes/Users.routes");
const BACKEND_PORT = 5001;


const app = express();
app.use(express.json()); //for parsing app//json
app.use(cors())

app.use("/api", userRouter)

app.listen(BACKEND_PORT, ()=>{
    console.log("SERVER WORKING")
})