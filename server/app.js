import express from "express";
import { connectDB } from "./utils/features.js";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

import UserRouter from "./routes/user.routes.js";
import ChatRouter from "./routes/chat.routes.js";

dotenv.config({
  path: "./.env",
});

const app = express();
const port = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Mongodb connection failed: ", error);
  });

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded());
app.use("/users", UserRouter);
app.use("/chats", ChatRouter);

app.use(errorMiddleware);
