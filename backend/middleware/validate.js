/**
 * Generic validation middleware
 * @param {Joi.ObjectSchema} schema - The Joi schema to validate against
 */
export const validate = (schema) => {
  return (req, res, next) => {
    // validate() returns an object with { error, value }
    // abortEarly: false ensures we catch ALL errors at once, not just the first one
    const { error } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true // Removes fields not defined in the schema for security
    });

    if (error) {
      // Map through the Joi error details to create a readable string
      const errorMessage = error.details
        .map((detail) => detail.message.replace(/"/g, ""))
        .join(", ");

      // Create a standard error object to be caught by the Global Error Handler
      const customError = new Error(errorMessage);
      customError.statusCode = 400; // Bad Request
      
      return next(customError);
    }

    // Replace req.body with the sanitized/validated version from Joi
    // (This is useful if you used .default() or .stripUnknown() in your schema)
    next();
  };
};