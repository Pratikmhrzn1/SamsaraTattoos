import User from "../models/User.js";

export const getAllUsers = async () => await User.find().select("-password");

export const findUserById = async (id) => await User.findById(id).select("-password");

export const createNewUser = async (userData) => await User.create(userData);

export const updateRole = async (id, role) => {
  return await User.findByIdAndUpdate(
    id,
    { role },
    { new: true, runValidators: true }
  ).select("-password");
};