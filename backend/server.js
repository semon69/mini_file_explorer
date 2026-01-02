const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHandler = require("./middleware/errorHandler");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ---- MongoDB Connection (cached) ----
let isConnected = false;

async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    throw err;
  }
}

// Ensure DB connection before handling requests
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Routes
app.use("/api/files", require("./routes/fileRoutes"));

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is running" });
});

// Error handler
app.use(errorHandler);

// ❌ DO NOT app.listen()
// ✅ Export app for Vercel
module.exports = app;
