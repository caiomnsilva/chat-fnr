import mongoose from "mongoose";
import userService from "../services/user.service.js";

export const validId = (req, res, next) => {
    try {
        const id = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: "Invalid ID!" });
        }

        next();
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const validUser = async (req, res, next) => {
    try {
        const id = req.params.id;

        const user = await userService.findByIdService(id);

        if (!user) {
            return res.status(400).send({ message: "User not found!" });
        }

        req.id = id;
        req.user = user;

        next();
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const validBodyPatch = async (req, res, next) => {
    try {
        const { name, cpf, email, gender } =
            req.body;

        if (
            !name ||
            !cpf ||
            !email ||
            !gender
        ) {
            res.status(400).json({
                message: "Submit at last one field for update!",
            });
        }

        next();
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const validBodyPost = async (req, res, next) => {
    try {
        const { name, cpf, email, gender } =
            req.body;

        if (
            !name ||
            !cpf ||
            !email ||
            !gender
        ) {
            res.status(400).json({
                message: "Submit all fields for registration",
            });
        }

        next();
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const validateEmail = (req, res, next) => {
    const { email } = req.body;
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (!email ||!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    next();
};

export const validateCpf = (req, res, next) => {
    const { cpf } = req.body;
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;

    if (!cpf ||!cpfRegex.test(cpf)) {
        return res.status(400).json({ message: "Invalid cpf format" });
    }

    next();
};

export default {
    validId,
    validUser,
    validBodyPost,
    validBodyPatch,
};
