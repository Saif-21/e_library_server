import Joi from "joi";

export const RegisterUserBodySchem = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    // password: Joi.string().min(8).required(),
    password: Joi.string().min(8).required().messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
        "string.min": "Password must be at least 8 characters long",
    }),
});

export const LoginUserBodySchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required().messages({
        "string.empty": "Password is required",
        "any.required": "Password is required",
    }),
});
