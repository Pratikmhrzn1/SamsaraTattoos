/**
 * Authorize specific roles
 * Usage: authorize("admin", "superadmin")
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    // console.log("User role:", req.user?.role);
    // console.log("Required roles:", roles);
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error(
        `Access denied. Required roles: ${roles.join(", ")}`
      );
      error.statusCode = 403;
      return next(error);
    }
    next();
  };
};