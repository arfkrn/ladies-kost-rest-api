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

const router = express.Router();

// user route
router.post("/register", register);
router.post("/login", login);

// kost route
router.post("/kost", verifyToken, createKost);
router.post("/kost/images", verifyToken, deleteKostImage);
router.put("/kost/:id", verifyToken, updateKost);
router.delete("/kost/:id", verifyToken, deleteKost);
router.put("/kost/:id/images", verifyToken, updateKostImage);

export default router;
