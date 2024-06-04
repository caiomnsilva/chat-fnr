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

const validBodyPatch = async (req, res, next) => {
    try {
        const { name, username, email, password, avatar, background } =
            req.body;

        if (
            !name &&
            !username &&
            !email &&
            !password &&
            !avatar &&
            !background
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

const validBodyPost = async (req, res, next) => {
    try {
        const { name, username, email, password, avatar, background } =
            req.body;

        if (
            !name ||
            !username ||
            !email ||
            !password ||
            !avatar ||
            !background
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

export default {
    validId,
    validUser,
    validBodyPost,
    validBodyPatch,
};
