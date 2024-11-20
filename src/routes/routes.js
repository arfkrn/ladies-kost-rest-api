import express from "express";
import multer from "multer";
import path from "path";
import url from "url";
import { getAllKost, getKost, createKost, updateKost, deleteKost } from "./../controllers/kostController.js"

const dir = new URL("../../", import.meta.url);
const directoryPath = url.fileURLToPath(dir);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(directoryPath, "/uploads"));
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const router = express.Router();
const upload = multer({ storage });

router.get("/kost", getAllKost);
router.get("/kost/:id", getKost);
router.post("/kost", upload.array("gambar", 5), createKost);
router.put("/kost/:id", updateKost);
router.delete("/kost/:id", deleteKost);

export default router;