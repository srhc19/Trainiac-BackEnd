import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import userRouter from "./routes/UserRoutes";
import clientRouter from "./routes/clientRoutes";
import { connectToDatabase } from "./dbConnection";
import mongoose from "mongoose";
import trainerRouter from "./routes/trainerRoutes";
import { createSocketServer } from "./helper/socket";
import http from "http";
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use("/user", userRouter);
app.use("/user/client", clientRouter);
app.use("/user/trainer", trainerRouter);

// Connect to MongoDB before starting the server
(async () => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
  const httpServer = http.createServer(app);
  const io = createSocketServer(httpServer);
  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
})();

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
});
