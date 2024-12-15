import Joi from "joi";

const registerValidationSchema = Joi.object({
    username: Joi.string()
        .alphanum()
        .replace("/<[^>]+>/g", "")
        .min(6)
        .max(10)
        .required(),
    password: Joi.string()
        .alphanum()
        .replace("/<[^>]+>/g", "")
        .min(8)
        .max(16)
        .required(),
}).options({ abortEarly: false });

const loginValidationSchema = Joi.object({
    username: Joi.string().alphanum().replace("/<[^>]+>/g", "").required(),
    password: Joi.string().alphanum().replace("/<[^>]+>/g", "").required(),
}).options({ abortEarly: false });

export { registerValidationSchema, loginValidationSchema };
