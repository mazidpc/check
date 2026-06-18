const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

const users = require("./Routes/users");
const notes = require("./Routes/notes");
const notifications = require("./Routes/notifications");

const cookieParser = require("cookie-parser");
const connectDb = require("./middleware/connectDb");

// Middlewares
app.use(cookieParser());
app.use(express.json());

// CORS
const allowedOrigins = [
  "http://localhost:5173",
  "https://bubtclassvault.vercel.app",
  "https://bubtclassvault.netlify.app",
];
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

// Routes
app.use("/api/users", users);
app.use("/api/notes", notes);
app.use("/api/notifications", notifications);

// Health check
app.get("/api", (req, res) => {
  res.send("Backend server is running");
});

// Connect DB, then start server
connectDb()
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(port, () => {
      console.log(`🚀 Server running at port ${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  });