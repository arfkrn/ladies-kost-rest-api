import { PrismaClient } from "@prisma/client";
import multer from "multer";
import Joi from "joi";
import path from "path";
import url from "url";

const prisma = new PrismaClient();

// const dir = new URL("../../", import.meta.url);
// const directoryPath = url.fileURLToPath(dir);

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.join(directoryPath, "/uploads"));
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.originalname);
//     },
// });

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        if (
            file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg"
        ) {
            cb(null, true);
        } else {
            return cb(new Error("Invalid file type"));
        }
    },
});

// Input validation Schema
const validationSchema = Joi.object({
    nama: Joi.string().required().max(30),
    deskripsi: Joi.string().required().max(200),
    harga: Joi.number().required().integer().positive().min(5),
}).options({ abortEarly: false });

// Get all data kost
const getAllKost = async (req, res) => {
    try {
        const result = await prisma.kost.findMany({
            include: {
                gambar: {
                    select: {
                        id: true,
                        imageUrl: true,
                    },
                },
            },
        });
        return res
            .status(200)
            .json({ success: true, data: result, errors: null });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, data: null, errors: error.message });
    }
};

// Get single data kost
// Parameter request
const getKost = async (req, res) => {
    if (!req.params) {
        return res.status(400).json({
            success: false,
            data: null,
            errors: "Parameter is required!",
        });
    }

    const { id } = req.params;

    try {
        const result = await prisma.kost.findUnique({
            where: {
                id: Number(id),
            },
            include: {
                gambar: {
                    select: {
                        imageUrl: true,
                    },
                },
            },
        });
        return res
            .status(200)
            .json({ success: true, data: result, errors: null });
    } catch (error) {
        return res.status(500).json({
            success: false,
            data: null,
            errors: error.message,
        });
    }
};

const imageUpload = upload.array("gambar", 5);
// Create new kost
// Multipart/form-data
const createKost = (req, res) => {
    imageUpload(req, res, async (err) => {
        // request body validation
        const { error } = validationSchema.validate(JSON.parse(req.body.data));
        if (error) {
            const errorList = error.details.map((error) => {
                return error.message.replace(/['"]/g, "");
            });
            return res
                .status(400)
                .json({ success: false, data: null, errors: errorList });
        }

        if (err) {
            return res
                .status(400)
                .json({ success: false, data: null, errors: err.message });
        }

        if (req.files === undefined) {
            return res
                .status(400)
                .json({ success: false, data: null, errors: "Image required" });
        }

        const { nama, deskripsi, harga } = JSON.parse(req.body.data);

        const imageUrls = req.files.map((img) => {
            return { imageUrl: img.originalname };
        });

        try {
            const result = await prisma.kost.create({
                data: {
                    nama,
                    deskripsi,
                    harga,
                    gambar: {
                        create: imageUrls,
                    },
                },
                select: {
                    nama: true,
                },
            });
            return res
                .status(201)
                .json({ success: true, data: result, errors: null });
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, data: null, errors: error.message });
        }
    });
};

// Update kost information
// JSON request
const updateKost = async (req, res) => {
    // Validate request body
    const { error } = validationSchema.validate(req.body);
    if (error) {
        const errorList = error.details.map((error) => {
            return error.message.replace(/['"]/g, "");
        });
        return res
            .status(400)
            .json({ success: false, data: null, errors: errorList });
    }

    const { nama, deskripsi, harga } = req.body;
    const { id } = req.params;

    try {
        const result = await prisma.kost.update({
            where: {
                id: Number(id),
            },
            data: {
                nama: nama || undefined,
                deskripsi: deskripsi || undefined,
                harga: Number(harga) || undefined,
            },
            select: {
                nama: true,
            },
        });
        return res
            .status(200)
            .json({ success: true, data: result, errors: null });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, data: null, errors: error.message });
    }
};

// Update kost image only
// Multipart/form-data request
const updateKostImage = (req, res) => {
    imageUpload(req, res, async (err) => {
        if (err) {
            return res
                .status(400)
                .json({ success: false, data: null, errors: err.message });
        }

        if (!req.body) {
            return res.status(400).json({
                success: false,
                data: null,
                errors: "Request body is required",
            });
        }

        const ids = JSON.parse(req.body.data).id;

        try {
            await Promise.all(
                ids.map(async (id, index) => {
                    await prisma.kostImages.upsert({
                        where: {
                            id: id,
                        },
                        update: {
                            imageUrl: req.files[index].originalname,
                        },
                        create: {
                            kostId: Number(req.params.id),
                            imageUrl: req.files[index].originalname,
                        },
                    });
                })
            );
            return res
                .status(201)
                .json({ success: true, data: null, errors: null });
        } catch (error) {
            return res
                .status(500)
                .json({ success: false, data: null, errors: error.message });
        }
    });
};

// Delete kost image only
// JSON request
const deleteKostImage = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            success: false,
            data: null,
            errors: "Request body is required",
        });
    }

    const ids = req.body.id;

    try {
        await Promise.all(
            ids.map(async (id) => {
                await prisma.kostImages.delete({
                    where: {
                        id,
                    },
                });
            })
        );
        return res
            .status(201)
            .json({ success: true, data: null, errors: null });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, data: null, errors: error.message });
    }
};

// Delete kost
// Parameter request
const deleteKost = async (req, res) => {
    if (!req.params) {
        return res.status(400).json({
            success: false,
            data: null,
            errors: "Request parameter is required",
        });
    }

    const { id } = req.params;

    try {
        await prisma.kost.delete({
            where: {
                id: Number(id),
            },
        });
        return res
            .status(200)
            .json({ success: true, data: null, errors: null });
    } catch (error) {
        return res
            .status(500)
            .json({ success: false, data: null, errors: error.message });
    }
};

export {
    getAllKost,
    getKost,
    createKost,
    updateKost,
    updateKostImage,
    deleteKostImage,
    deleteKost,
};
