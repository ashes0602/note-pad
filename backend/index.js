import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import loginRoute from "./routes/loginroute.js";
import registrationRoute from "./routes/registrationroute.js";  
import pageRoute from "./routes/pageroutes.js";

import cors from "cors"

dotenv.config();

// ✅ MongoDB connection
mongoose.connect(process.env.mongodb_URI || process.env.mongo_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));

const app = express();

app.use(cors({
  origin: "http://localhost:3000", // frontend ka URL
  credentials: true,              // agar cookies / auth bhejni hain
}));

// ✅ Fix: use express.json() (you missed the brackets)
app.use(express.json());

// ✅ Test route for browser
app.get("/", (req, res) => {
  console.log("🌍 Test route was hit from the browser");
  res.send("🚀 Server is running and MongoDB is connected!");
});

// Routes
app.use("/auth", registrationRoute);
app.use("/auth", loginRoute);
app.use("/auth", pageRoute);

let port = 5000;
app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});
