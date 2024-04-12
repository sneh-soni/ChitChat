import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { connectDB } from "./utils/features.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { v4 as uuid } from "uuid";
import cors from "cors";
import { v2 as cloudinary } from "cloudinary";
import { corsOptions } from "./constants/config.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { getSockets } from "./lib/helpers.js";
import { Message } from "./models/message.model.js";
import { socketAuth } from "./middlewares/auth.js";

import ChatRouter from "./routes/chat.routes.js";
import UserRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";

dotenv.config({
  path: "./.env",
});

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: corsOptions,
});
app.set("io", io);
const port = process.env.PORT || 3000;
export const userSocketIDs = new Map();

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Mongodb connection failed: ", error);
  });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded());
app.use(cors(corsOptions));
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/chats", ChatRouter);
app.use("/api/v1/admin", adminRouter);

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, async (err) => {
    await socketAuth(err, socket, next);
  });
});

io.on("connection", (socket) => {
  const user = socket.user;

  userSocketIDs.set(user._id.toString(), socket.id);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRT = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    const membersSockets = getSockets(members);

    io.to(membersSockets).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRT,
    });

    io.to(membersSockets).emit(NEW_MESSAGE_ALERT, {
      chatId,
    });

    try {
      await Message.create(messageForDB);
    } catch (error) {
      console.log(error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected: ", socket.id);
    userSocketIDs.delete(user._id.toString());
  });
});

app.use(errorMiddleware);
