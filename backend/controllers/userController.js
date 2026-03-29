import User from "../models/User.js";
export const createUser = async (req, res, next) => {
  try {
    const { firstName, email, password, phoneNumber, lastName } = req.body;
    /**
     * Checks if the required fields are filled
     */
    if (!firstName || !email || !password || !phoneNumber || !lastName) {
      const error = new Error("First name, last name, phone number, email and password are required");
      error.statusCode = 400;
      throw error;
    }
    const user = await User.create({firstName, email,password, lastName, phoneNumber });
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
export const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};