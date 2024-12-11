import { PrismaClient } from "@prisma/client";
import Joi from "joi";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const inputValidationSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
}).options({ abortEarly: false });

const prisma = new PrismaClient();

const login = async (req, res) => {
    const { error } = inputValidationSchema.validate(req.body);
    if (error) {
        const validationErrors = error.details.map((error) => {
            return error.message.replace(/['"]/g, "");
        });

        return res
            .status(400)
            .json({ success: false, data: null, errors: validationErrors });
    }

    const { username, password } = req.body;

    try {
        const user = await prisma.users.findUnique({
            where: {
                username,
            },
            select: {
                username: true,
                password: true,
            },
        });

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                data: null,
                errors: "Username or Password invalid!",
            });
        }

        const token = jwt.sign(
            { username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "2h" }
        );

        const data = { username: user.username, token };

        res.status(200).json({ success: true, data, errors: null });
    } catch (error) {
        return res.status(500).json({
            success: false,
            token: null,
            errors: error.message,
        });
    }
};

const register = async (req, res) => {
    const { error } = inputValidationSchema.validate(req.body);
    if (error) {
        const validationErrors = error.details.map((error) => {
            return error.message.replace(/['"]/g, "");
        });

        return res
            .status(400)
            .json({ success: false, data: null, errors: validationErrors });
    }

    const { username, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await prisma.users.create({
            data: {
                username,
                password: hashedPassword,
            },
            select: {
                username: true,
            },
        });

        res.status(201).json({
            success: true,
            data: user.username,
            errors: null,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            token: null,
            errors: error.message,
        });
    }
};

export { login, register };
