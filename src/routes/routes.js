import express from "express";
import {
    getAllKost,
    getKost,
    createKost,
    updateKost,
    updateKostImage,
    deleteKostImage,
    deleteKost,
} from "./../controllers/kostController.js";

const router = express.Router();

router.get("/kost", getAllKost);
router.post("/kost", createKost);
router.post("/kost/images", deleteKostImage);
router.get("/kost/:id", getKost);
router.put("/kost/:id", updateKost);
router.delete("/kost/:id", deleteKost);
router.put("/kost/:id/images", updateKostImage);

export default router;
