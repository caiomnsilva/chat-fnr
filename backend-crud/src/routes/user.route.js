import { Router } from "express";
import userController from "../controllers/user.controller.js";
import {
    validId,
    validUser,
    validBodyPost,
} from "../middlewares/global.middlewares.js";

const router = Router();

router.post("/", validBodyPost, userController.create);
router.get("/", userController.findAll);
router.get("/:id", validId, validUser, userController.findById);
router.put("/:id", validId, validUser, userController.update);
router.delete("/:id", validId, validUser, userController.deleteById);

export default router;
