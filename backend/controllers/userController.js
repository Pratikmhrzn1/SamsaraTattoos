import * as userService from "../services/userServices.js"
import log from "../utils/logger.js";

export const createUser = async (req, res, next) => {
  try {
    const user = await userService.createNewUser(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.json({ success: true, count: users.length, data: users });
    log("success","Users are found!");
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const user = await userService.findUserById(req.params.id);
    if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
    log("success","User available!");
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const user = await userService.updateRole(req.params.id, req.body.role);
    if (!user) throw Object.assign(new Error("User not found"), { statusCode: 404 });
    res.json({ success: true, message: "Role updated", user });
  } catch (error) {
    next(error);
  }
};