import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import log from "./utils/logger.js";
const app = express();
dotenv.config();
const PORT = process.env.PORT;
app.get("/", (req, res) => {
  res.send("Hello World");
});
connectDB();
app.listen(PORT, () => {
  log("success",`Backend app listening on port: http://localhost:${PORT}`);
});
