// import User from "../models/User.js";
// import bcrypt from "bcryptjs";
// import { generateToken } from "../utils/generateToken.js";
// import log from "../utils/logger.js";

// export const registerUser = async (req, res, next) => {
//   try {
//     const { firstName, lastName, email, password, phoneNumber } = req.body;
//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       const error = new Error("The user already exists!");
//       error.statusCode = 400;
//       throw error;
//     }
//     const user = await User.create({
//       firstName,
//       lastName,
//       email,
//       password,
//       phoneNumber,
//     });
//     const token = generateToken(user._id);
//     log("success", "User registered successfully!");
//     res.status(201).json({
//       success: true,
//       token,
//       user,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// export const loginUser = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       const error = new Error("Email and password required");
//       error.statusCode = 400;
//       throw error;
//     }

//     const user = await User.findOne({ email });

//     if (!user) {
//       const error = new Error("Invalid email or password!");
//       error.statusCode = 401;
//       throw error;
//     }

//     const isMatch = await bcrypt.compare(password, user.password);

//     if (!isMatch) {
//       const error = new Error("Invalid email or password!");
//       error.statusCode = 401;
//       throw error;
//     }

//     const token = generateToken(user._id);

//     res.status(200).json({
//       success: true,
//       token,
//       user,
//     });
//   } catch (error) {
//     next(error);
//   }
// };
import * as authService from "../services/authService.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import log from "../utils/logger.js";
export const registerUser = async (req, res, next) => {
  try {
    const userExists = await authService.findUserByEmail(req.body.email);
    if (userExists) {
      const error = new Error("User already exists!");
      error.statusCode = 401;
      throw error;
    }
    const user = await authService.registerUser(req.body);
    const token = generateToken(user._id);
    log("success", "User registered successfully!");
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
    const user = await authService.findUserByEmail(req.body.email);
    if (!user) {
      const error = new Error("User doesn't exist");
      error.statusCode = 404;
      throw error;
    }
    const isMatch = await bcrypt.compare(password,user.password);
    if(!isMatch){
      const error = new Error("Invalid credentials!");
      error.statusCode = 401;
      throw error;
    }
    const token = generateToken(user._id);
    res.status(201).json({
      success:true,
      token,
      user,
      message:"Use the token given above for the authorizating ur rights!"
    })
    log("success","User logged in successfully");
  } catch (error) {
    next(error);
  }
};
