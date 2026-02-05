import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import loginRoute from "./routes/loginroute.js";
import registrationRoute from "./routes/registrationroute.js";  
import pageRoute from "./routes/pageroutes.js";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.mongodb_URI || process.env.mongo_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB connected"))
.catch((err) => console.error("❌ MongoDB connection error:", err));


const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",      
  "https://ashes-mart.netlify.app" 
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); 
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use(express.json());


app.get("/", (req, res) => {
  console.log("🌍 Test route was hit from the browser");
  res.send("🚀 Server is running and MongoDB is connected!");
});


app.use("/auth", registrationRoute);
app.use("/auth", loginRoute);
app.use("/auth", pageRoute);


app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
