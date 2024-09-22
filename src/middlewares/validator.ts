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

export const BookRecordBodySchema = Joi.object({
    title: Joi.string().required(),
    author: Joi.string().required(),
    genre: Joi.string().required(),
    description: Joi.string().required(),
    publishedDate: Joi.date().iso().required(), // Accepts date in ISO format (yyyy-mm-dd)

    coverImage: Joi.object({
        originalname: Joi.string().required(), // File name validation
        mimetype: Joi.string()
            .valid("image/jpeg", "image/png", "image/gif")
            .required(), // File type validation
        size: Joi.number()
            .max(1024 * 1024 * 2)
            .required(), // Limit file size to 2MB
    }).required(),

    bookPdf: Joi.object({
        originalname: Joi.string().required(),
        mimetype: Joi.string().valid("application/pdf").required(),
        size: Joi.number()
            .max(1024 * 1024 * 5)
            .required(), // Limit PDF size to 5MB
    }).required(),

    isAvailable: Joi.boolean(),
});
