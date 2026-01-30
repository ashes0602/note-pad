import express from "express";
import { register } from "../controller/registercontroller.js";

const router = express.Router();

// Route for registration
router.post("/register", register);

export default router;
