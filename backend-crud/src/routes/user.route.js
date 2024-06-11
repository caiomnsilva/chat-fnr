import { Router } from "express";
import userController from "../controllers/user.controller.js";
import {
    validId,
    validUser,
    validBodyPost,
    validateEmail,
    validateCpf,
} from "../middlewares/global.middlewares.js";

const router = Router();

router.post("/", validBodyPost, validateEmail, validateCpf, userController.create);
router.get("/", userController.findAll);
router.get("/:id", validId, validUser, userController.findById);
router.put("/:id", validId, validUser, validateEmail, validateCpf, userController.update);
router.delete("/:id", validId, validUser, userController.deleteById);

export default router;
