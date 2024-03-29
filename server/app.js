import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { connectDB } from "./utils/features.js";
import { Server } from "socket.io";
import { createServer } from "http";
import { v4 as uuid } from "uuid";
import cors from "cors";

import ChatRouter from "./routes/chat.routes.js";
import UserRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
import { NEW_MESSAGE, NEW_MESSAGE_ALERT } from "./constants/events.js";
import { getSockets } from "./lib/helpers.js";
import { Message } from "./models/message.model.js";

dotenv.config({
  path: "./.env",
});

const app = express();
const server = createServer(app);
const io = new Server(server, {});
const port = process.env.PORT || 3000;
export const userSocketIDs = new Map();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded());
app.use(
  cors({
    origin: ["http://localhost:3001", process.env.CLIENT_URL],
    credentials: true,
  })
);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/chats", ChatRouter);
app.use("/api/v1/admin", adminRouter);

io.use((socket, next) => {});

io.on("connection", (socket) => {
  console.log("User connected: ", socket.id);

  const user = {
    _id: "kjsdgj",
    name: "kjnsag",
  };

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

connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.log("Mongodb connection failed: ", error);
  });

app.use(errorMiddleware);
