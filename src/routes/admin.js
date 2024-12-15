import express from "express";
import {
    createKost,
    updateKost,
    updateKostImage,
    deleteKostImage,
    deleteKost,
} from "./../controllers/kostController.js";
import { login, register } from "../controllers/userController.js";
import verifyToken from "../middleware/verifyToken.js";
import authorization from "../middleware/userAuthorization.js";

const router = express.Router();

// user route
router.post("/register", register);
router.post("/login", login);

// kost route
router.post("/kost", verifyToken, authorization, createKost);
router.post("/kost/images", verifyToken, authorization, deleteKostImage);
router.put("/kost/:id", verifyToken, authorization, updateKost);
router.delete("/kost/:id", verifyToken, authorization, deleteKost);
router.put("/kost/:id/images", verifyToken, authorization, updateKostImage);

export default router;
