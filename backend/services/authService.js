import User from "../models/User.js";
export const registerUser = async (userData) => {
    return await User.create(userData);
}
export const findUserByEmail = async(email)=>{
    return await User.findOne({email});
}
// export const findUserForLogin = async(email)=>{
//     return await User.findOne({email})
// }