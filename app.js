import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import router from "./src/routes/routes.js";
import admin from "./src/routes/admin.js";

const app = express();
const port = process.env.PORT || 4001;
const corsOptions = {
    origin: "http://localhost:5173",
};
app.use(express.json());
app.use(cors(corsOptions));
app.use("/api/v1", router);
app.use("/api/v1/admin", admin);
app.use("/uploads", express.static("uploads"));

const server = app.listen(port, () => {
    console.log("Server running on port: ", port);
});

const gracefullShutdown = async () => {
    console.log("Shutting down...");
    server.close(() => {
        console.log("Http server closed");
    });

    process.exit(0);
};

process.on("SIGINT", gracefullShutdown);
process.on("SIGTERM", gracefullShutdown);

export default app;
