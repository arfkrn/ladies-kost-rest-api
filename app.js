import express from "express";
import router from "./src/routes/routes.js";
import { PrismaClient } from "@prisma/client";

const app = express();
const port = 4000;
const prisma = new PrismaClient();

app.use(express.json());
app.use("/api", router);

const server = app.listen(port, () => {
    console.log("Server running on port: ", port);
});

const gracefullShutdown = async () => {
    console.log("Shutting down...");
    server.close(() => {
        console.log("Http server closed")
    });
    
    try {
        await prisma.$disconnect();
        console.log("Database connection closed");
    } catch (err) {
        console.log("Error closing database connection: ", err);
    }

    process.exit(0);
}

process.on("SIGINT", gracefullShutdown);
process.on("SIGTERM", gracefullShutdown);
