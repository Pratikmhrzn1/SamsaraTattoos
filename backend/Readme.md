
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