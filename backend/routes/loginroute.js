import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import {login} from "../controller/logincontroller.js";

const router = express.Router();
// Login route
router.post("/login",login);
    
export default router;