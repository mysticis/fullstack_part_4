const config = require("./utils/config")
const express = require("express")
const bodyParser = require("body-parser")
const app = express()
const cors = require("cors")
const blogRouter = require("./controllers/routes")
const mongoose = require("mongoose")
const middleware = require("./utils/middleware")
console.log("connecting to", config.MONGODB_URI)

mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("connected to MongoDB")
  })
  .catch(error => {
    console.log("error connecting to MongoDB:", error.message)
  })

app.use(cors())
app.use(express.static("build"))
app.use(bodyParser.json())
app.use(middleware.requestLogger)
app.use("/api/blogs", blogRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
module.exports = app
