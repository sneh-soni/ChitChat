import { TryCatch } from "../middlewares/error.middleware.js";
import { User } from "../models/user.model.js";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";
import { ErrorHandler } from "../utils/utility.js";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../utils/features.js";

const adminLogin = TryCatch(async (req, res, next) => {
  const { secretKey } = req.body;

  if (req.cookies["admin-token"] !== undefined)
    return next(new ErrorHandler("Already Logged In", 401));

  const isMatched = secretKey === process.env.ADMIN_SECRET_KEY;

  if (!isMatched) return next(new ErrorHandler("Invalid Secret Key", 401));

  const adminToken = jwt.sign(secretKey, process.env.JWT_SECRET);

  return res
    .status(200)
    .cookie("admin-token", adminToken, {
      ...cookieOptions,
      maxAge: 1000 * 60 * 30,
    })
    .json({
      success: true,
      message: "Admin authentication Successful",
    });
});

const adminLogout = TryCatch(async (req, res, next) => {
  return res
    .status(200)
    .cookie("admin-token", "", {
      ...cookieOptions,
      maxAge: 0,
    })
    .json({
      success: true,
      message: "Admin Logged Out Successfully",
    });
});

const getIsAdmin = TryCatch(async (req, res) => {
  return res.status(200).json({
    admin: true,
  });
});

const getAllUsers = TryCatch(async (req, res) => {
  const users = await User.find({});

  const transformedUsers = await Promise.all(
    users.map(async ({ _id, name, username, avatar }) => {
      const [friends, groups] = await Promise.all([
        Chat.countDocuments({ groupChat: false, members: _id }),
        Chat.countDocuments({ groupChat: true, members: _id }),
      ]);

      return {
        _id,
        name,
        username,
        avatar: avatar.url,
        friends,
        groups,
      };
    })
  );

  return res.status(200).json({
    success: true,
    transformedUsers,
  });
});

const getAllChats = TryCatch(async (req, res) => {
  const chats = await Chat.find({})
    .populate("members", "name avatar")
    .populate("creator", "name avatar");

  const transformedChats = await Promise.all(
    chats.map(async ({ _id, name, groupChat, members, creator }) => {
      const totalMessages = await Message.countDocuments({ chat: _id });

      return {
        _id,
        name,
        groupChat,
        avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
        members: members.map(({ _id, name, avatar }) => ({
          _id,
          name,
          avatar: avatar.url,
        })),
        creator: {
          name: creator?.name || "None",
          avatar: creator?.avatar.url || "",
        },
        totalMembers: members.length,
        totalMessages,
      };
    })
  );

  return res.status(200).json({
    success: true,
    transformedChats,
  });
});

const getAllMessages = TryCatch(async (req, res) => {
  const messages = await Message.find({})
    .populate("sender", "name avatar")
    .populate("chat", "groupChat");

  const transformedMessages = messages.map(
    ({ content, attachments, _id, sender, createdAt, chat }) => ({
      _id,
      groupChat: chat.groupChat,
      chat: chat._id,
      content,
      attachments,
      createdAt,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    })
  );

  return res.status(200).json({
    success: true,
    transformedMessages,
  });
});

const getDashboardStats = TryCatch(async (req, res) => {
  const [groupsCount, usersCount, messagesCount, totalchatsCount] =
    await Promise.all([
      Chat.countDocuments({ groupChat: true }),
      User.countDocuments({}),
      Message.countDocuments({}),
      Chat.countDocuments({}),
    ]);

  const today = new Date();
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const last7DaysMessages = await Message.find({
    createdAt: { $gte: last7Days, $lte: today },
  }).select("createdAt");

  const messages = new Array(7).fill(0);

  last7DaysMessages.forEach((message) => {
    const index = Math.floor(
      (today.getTime() - message.createdAt.getTime()) / (1000 * 60 * 60 * 24)
    );

    messages[6 - index]++;
  });

  const stats = {
    groupsCount,
    usersCount,
    messagesCount,
    totalchatsCount,
    messagesChart: messages,
  };

  return res.status(200).json({
    success: true,
    stats,
  });
});

export {
  getAllUsers,
  getAllChats,
  getAllMessages,
  getDashboardStats,
  adminLogin,
  adminLogout,
  getIsAdmin,
};
