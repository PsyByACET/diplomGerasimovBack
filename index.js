const express = require("express");
const cors = require("cors");
require("dotenv").config();
const sequelize = require("./db")
const models = require ('./models/models')
const fileUpload = require("express-fileupload");
const errorHandler = require('./middleware/ErrorHandingMiddleware')
const path = require('path')

const userRouter = require("./Routes/Users.routes");
const BACKEND_PORT = 5001;

const app = express();
app.use(express.json()); //for parsing app//json
app.use(cors())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))

app.use("/api", userRouter)

app.use(errorHandler)

const date = new Date('Sat Feb 23 2222 01:22:00 GMT+0300 (Москва, стандартное время')
; console.log(date.toLocaleString("en-US", {
    weekday: "long",
    hour: "numeric",
    minute: "numeric",
    hourCycle: "h23",
}))

const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(BACKEND_PORT, () =>
            console.log(`SERVER STARTED ON PORT ${BACKEND_PORT}`)
        );
    } catch (e) {
        console.log(e);
    }
};

start();
