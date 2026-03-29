import jwt from 'jsonwebtoken'
/**
 * Generates jwt token containing uid of user signed with a secret key which expires in 7 days
 * Let us suppose it as a digital id card given after login
 */
export const generateToken = (id) =>{
    return jwt.sign(
        {id},
        process.env.JWT_SECRET,
        {expiresIn:process.env.JWT_EXPIRE_IN}
    )
}