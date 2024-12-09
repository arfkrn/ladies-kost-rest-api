import express from "express";
import { getAllKost, getKost } from "../controllers/kostController.js";
const router = express.Router();

router.get("/kost", getAllKost);
router.get("/kost/:id", getKost);

export default router;
