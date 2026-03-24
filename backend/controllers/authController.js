import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import log from "../utils/logger.js";

export const registerUser = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, phoneNumber } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      const error = new Error("The user already exists!");
      error.statusCode = 400;
      throw error;
    }
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
    });
    const token = generateToken(user._id);
    log("success", "User registered");
    res.status(201).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Email and password required");
      error.statusCode = 400;
      throw error;
    }

    
    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("Invalid email or password!");
      error.statusCode = 401;
      throw error;
    }

    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      const error = new Error("Invalid email or password!");
      error.statusCode = 401;
      throw error;
    }

    
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};



