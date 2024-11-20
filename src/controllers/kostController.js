import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getAllKost = async (req, res) => {
    const kost = await prisma.kost.findMany({
        include: {
            gambar: {
                select: {
                    imageUrl: true
                }
            }
        }
    });

    res.status(200).json({ success: true, data: kost, message: "OK" });
}

export const getKost = async (req, res) => {
    const { id } = req.params;

    const kost = await prisma.kost.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            gambar: {
                select: {
                    imageUrl: true
                }
            }
        }
    });

    res.status(200).json({ success: true, data: kost, message: "OK" });
}

export const createKost = async (req, res) => {
    const { nama, deskripsi, harga } = req.body;
    console.log(req.files);

    const imageUrls = new Array();

    for (const img of req.files) {
        const imgUrl = { imageUrl: img.path };
        imageUrls.push(imgUrl);
    }

    await prisma.kost.create({
        data: {
            nama,
            deskripsi,
            harga,
            gambar: {
                create: imageUrls
            }
        }
    });

    res.status(201).json({ success: true, message: "OK" });
}

export const updateKost = async (req, res) => {
    const { nama, deskripsi, harga } = req.body;
    const { id } = req.params;

    await prisma.kost.update({
        where: {
            id: Number(id)
        },
        data: {
            nama,
            deskripsi,
            harga,
        }
    });

    res.status(200).json({ success: true, message: "OK" });    
}

export const deleteKost = async (req, res) => {
    const { id } = req.params;

    await prisma.kost.delete({
        where: {
            id: Number(id)
        }
    });

    res.status(200).json({ success: true, message: "OK" });
}