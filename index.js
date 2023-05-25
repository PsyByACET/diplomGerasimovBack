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
