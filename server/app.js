import express from "express";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import UserRouter from "./routes/user.routes.js";

dotenv.config({
  path: "./.env",
});

connectDB();

const app = express();

app.use("/users", UserRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
