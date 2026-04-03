// middleware/authorize.js
export const ROLE = Object.freeze({
  USER: 1,
  ADMIN: 2,
  SUPERADMIN: 3
});

export const authorize = (...minimumRoleLevel) => {
  return (req, res, next) => {
    // Safety: ensure 'protect' middleware ran first
    if (!req.user) {
      const error = new Error("Authentication required");
      error.statusCode = 401;
      return next(error);
    }

    if (req.user.role < minimumRoleLevel) {
      const error = new Error("Access denied. Insufficient permissions.");
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};