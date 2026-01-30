import bcrypt from "bcrypt";
import User from "../models/user.js";

// Registration controller
export const register = async (req, res) => {
  console.log("📩 Request received at /auth/register");
  const { email, password,cpassword } = req.body;
  console.log("👉 Request body:", req.body);

  try {
    console.log("🔍 Checking if user already exists...");
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("⚠️ Email already exists:", email);
      return res.status(400).json({ message: "Email already exists" });
    }

    console.log("🔑 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("📝 Creating new user...");
    const newUser = new User({
      email,
      password: hashedPassword,
      cpassword:hashedPassword
    });

    console.log("💾 Saving user to database...");
    await newUser.save();

    console.log("✅ User registered successfully:", email);
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("❌ Error during registration:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
