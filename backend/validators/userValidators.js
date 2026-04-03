import Joi from "joi";

export const userRegisterSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  phoneNumber: Joi.string().min(10).required(),
  role: Joi.number().valid(1, 2, 3).default(1),
});

export const roleUpdateSchema = Joi.object({
  role: Joi.number().valid(1, 2, 3).required(),
});
export const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required to login",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required to login",
  }),
});
/**
 * We can rather use this if we have large registration form and do not want to repeat the code , it is one of
 * the crucial feature of joi that allows us to extract the common parts
 * Here in the code given below: firstName lastName and phoneNumberare forbidden in loginSchema
 */
// export const loginSchema = userRegisterSchema.fork(
//   ['firstName', 'lastName', 'phoneNumber'],
//   (schema) => schema.forbidden()
// );
