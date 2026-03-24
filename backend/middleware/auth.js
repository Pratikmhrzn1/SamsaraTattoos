import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      const err = new Error("Not authorized, token failed");
      err.statusCode = 401;
      next(err);
    }
  } else {
    const err = new Error("Not authorized, no token");
    err.statusCode = 401;
    next(err);
  }
};