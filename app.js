import express from "express";
import "dotenv/config";
import router from "./src/routes/routes.js";
import admin from "./src/routes/admin.js";

const app = express();
const port = 4000;

app.use(express.json());
app.use("/api/v1", router);
app.use("/api/v1/admin", admin);

const server = app.listen(port, () => {
  console.log("Server running on port: ", port);
});

const gracefullShutdown = async () => {
  console.log("Shutting down...");
  server.close(() => {
    console.log("Http server closed");
  });

  // try {
  //   await prisma.$disconnect();
  //   console.log("Database connection closed");
  // } catch (err) {
  //   console.log("Error closing database connection: ", err);
  // }

  process.exit(0);
};

process.on("SIGINT", gracefullShutdown);
process.on("SIGTERM", gracefullShutdown);
