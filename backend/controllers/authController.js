import User from '../models/User';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken';
import log from '../utils/logger';

export const registerUser = async() =>{
    try{
        const {firstName,lastName,email,password,phoneNumber} =req.body;
        const userExists = await User.findOne({email});
        if(userExists){
            const error = new Error("The user already exists!");
            error.statusCode=400;
            throw error;
        }
        
    }
    catch(error){
        next(error);
    }
}


























/**
 * ### 2. Auth Flow — How it all works together
REGISTER:
User sends name/email/password
        ↓
Check if email already exists
        ↓
Create user in MongoDB (password gets hashed automatically by pre-save hook)
        ↓
Generate JWT token
        ↓
Return token + user

LOGIN:
User sends email/password
        ↓
Find user by email
        ↓
Compare password with hashed password
        ↓
Generate JWT token
        ↓
Return token + user

PROTECTED ROUTE (getMe, updateMe, deleteMe):
User sends request with token in header
        ↓
protect middleware runs first
        ↓
Verify token is valid
        ↓
Find user from token's id
        ↓
Attach user to req.user
        ↓
Controller runs
 */