const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")
const errorHandler = require("./middleware/errorHandler")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Database Connection
const MONGO_URI = process.env.MONGO_URI

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

// Routes
app.use("/api/files", require("./routes/fileRoutes"))

// Basic route
app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" })
})

// Error handler middleware
app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
