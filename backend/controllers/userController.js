import User from "../models/User.js";
export const createUser = async (req, res, next) => {
  try {
    const { firstName, email, password, phoneNumber, lastName } = req.body;
    /**
     * Checks if the required fields are filled
     */
    if (!firstName || !email || !password || !phoneNumber || !lastName) {
      const error = new Error(
        "First name, last name, phone number, email and password are required",
      );
      error.statusCode = 400;
      throw error;
    }
    const user = await User.create({
      firstName,
      email,
      password,
      lastName,
      phoneNumber,
    });
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
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const allowedRoles = ["user", "admin", "superadmin"];
    if (!allowedRoles.includes(role)) {
      const error = new Error("Invalid role");
      error.statusCode = 400;
      throw error;
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password");
    if(!user){
      const error= new Error("User not found");
      error.statusCode=404;
      throw error;
    }
    res.status(200).json({
      success:true,
      message:`User role updated to ${role}`,
      user
    });
  } 
  catch (error) {
    next(error);
  }
};
