import { deleteFilesFromCloudinary, emitEvent } from "../utils/features.js";
import { TryCatch } from "../middlewares/error.middleware.js";
import { ErrorHandler } from "../utils/utility.js";
import { Chat } from "../models/chat.model.js";
import { User } from "../models/user.model.js";
import { Message } from "../models/message.model.js";
import {
  ALERT,
  NEW_ATTACHMENT,
  NEW_MESSAGE_ALERT,
  REFETCH_CHATS,
} from "../constants/events.js";
import { getOtherMembers } from "../lib/helpers.js";

const newGroupChat = TryCatch(async (req, res, next) => {
  const { name, members } = req.body;

  const allMembers = [...members, req.user];

  await Chat.create({
    name,
    groupChat: true,
    creator: req.user,
    members: allMembers,
  });

  emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
  emitEvent(req, REFETCH_CHATS, members);

  return res.status(201).json({
    success: true,
    message: "Group Created Successfully",
  });
});

const getMyChats = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({ members: req.user }).populate(
    "members",
    "name avatar"
  );

  const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
    const otherMembers = getOtherMembers(members, req.user);
    return {
      _id,
      groupChat,
      members: members.reduce((prev, curr) => {
        if (curr._id.toString() !== req.user.toString()) prev.push(curr._id);
        return prev;
      }, []),
      name: groupChat ? name : otherMembers.name,
      avatar: groupChat
        ? members.slice(0, 3).map(({ avatar }) => avatar.url)
        : [otherMembers.avatar.url],
    };
  });
  return res.status(200).json({
    success: true,
    chats: transformedChats,
  });
});

const getMyGroups = TryCatch(async (req, res, next) => {
  const chats = await Chat.find({
    members: req.user,
    groupChat: true,
    creator: req.user,
  }).populate("members", "name avatar");

  const groups = chats.map(({ _id, name, members, groupChat }) => ({
    _id,
    groupChat,
    name,
    avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
  }));

  return res.status(200).json({
    success: true,
    groups,
  });
});

const addMembers = TryCatch(async (req, res, next) => {
  const { chatId, members } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("Please Select a Group chat", 400));

  if (chat.creator.toString() !== req.user.toString())
    return next(
      new ErrorHandler("Only Admin is allowed to add new members", 403)
    );

  const allNewMembersPromise = members.map((i) => User.findById(i, "name"));

  const allNewMembers = await Promise.all(allNewMembersPromise);

  const uniqueMembers = allNewMembers
    .filter((i) => !chat.members.includes(i._id.toString()))
    .map((i) => i._id);

  chat.members.push(...uniqueMembers);

  if (chat.members.length > 50)
    return next(new ErrorHandler("Group members limit reached", 400));

  await chat.save();

  const allUsersName = allNewMembers.map(({ name }) => name).join(",");

  emitEvent(req, ALERT, chat.members, `${allUsersName} has been added`);

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Members added successfully",
  });
});

const removeMember = TryCatch(async (req, res, next) => {
  const { chatId, userId } = req.body;

  if (!chatId || !userId || chatId.length < 1 || userId.length < 1)
    return next(new ErrorHandler("Invalid request", 400));

  const [chat, user] = await Promise.all([
    Chat.findById(chatId),
    User.findById(userId),
  ]);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("Please Select a Group chat", 400));

  if (chat.creator.toString() !== req.user.toString())
    return next(
      new ErrorHandler("Only Admin is allowed to add new members", 403)
    );

  if (chat.members.length <= 3)
    return next(new ErrorHandler("Group must have atleast 3 members", 400));

  if (!chat.members.includes(userId.toString()))
    return next(new ErrorHandler("User not found in group", 400));

  chat.members = chat.members.filter(
    (i) => i.toString() !== user._id.toString()
  );

  await chat.save();

  emitEvent(req, ALERT, chat.members, `${user.name} has been removed`);

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Member removed successfully",
  });
});

const leaveGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.Id;

  if (!chatId || chatId.length < 1)
    return next(new ErrorHandler("Invalid request", 400));

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("Please Select a Group chat", 400));

  if (!chat.members.includes(req.user.toString())) {
    return next(new ErrorHandler("User not found in group", 400));
  }
  const remainingMembers = chat.members.filter(
    (i) => i.toString() !== req.user.toString()
  );

  if (remainingMembers.length < 3)
    return next(new ErrorHandler("Group must have atleast 3 members", 400));

  if (chat.creator.toString() !== req.user.toString()) {
    chat.creator = remainingMembers[0];
  }

  chat.members = remainingMembers;

  const [user] = await Promise.all([
    User.findById(req.user, "name"),
    chat.save(),
  ]);

  emitEvent(req, ALERT, chat.members, `${user.name} has left the group`);

  return res.status(200).json({
    success: true,
    message: "Member leaved successfully",
  });
});

const sendAttachments = TryCatch(async (req, res, next) => {
  const { chatId } = req.body;

  const [chat, user] = await Promise.all([
    Chat.findById(chatId),
    User.findById(req.user, "name"),
  ]);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  const files = req.files || [];

  if (files.length < 1)
    return next(new ErrorHandler("Please provide attachments", 400));

  if (files.length > 5)
    return next(
      new ErrorHandler("maximum number of attachments can be 5", 400)
    );

  // cloudinary

  const attachments = [];

  const messageForRT = {
    content: "",
    attachments,
    chat: chatId,
    sender: {
      _id: user._id,
      name: user.name,
    },
  };

  const messageForDB = {
    content: "",
    attachments,
    chat: chatId,
    sender: user._id,
  };

  const message = await Message.create(messageForDB);

  emitEvent(req, NEW_ATTACHMENT, chat.members, {
    message: messageForRT,
    chatId,
  });

  emitEvent(req, NEW_MESSAGE_ALERT, chat.members, {
    chatId,
  });

  return res.status(200).json({
    success: true,
    message,
  });
});

const getChatDetails = TryCatch(async (req, res, next) => {
  if (req.query.populate === "true") {
    const chat = await Chat.findById(req.params.Id)
      .populate("members", "name avatar")
      .lean();

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    chat.members = chat.members.map(({ _id, name, avatar }) => ({
      _id,
      name,
      avatar: avatar.url,
    }));

    return res.status(200).json({
      success: true,
      chat,
    });
  } else {
    const chat = await Chat.findById(req.params.Id);

    if (!chat) return next(new ErrorHandler("Chat not found", 404));

    return res.status(200).json({
      success: true,
      chat,
    });
  }
});

const renameGroup = TryCatch(async (req, res, next) => {
  const chatId = req.params.Id;

  const { name } = req.body;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  if (!chat.groupChat)
    return next(new ErrorHandler("This is not a group chat", 400));

  if (chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("Only Admin is allowed to rename group", 403));

  chat.name = name;

  await chat.save();

  emitEvent(req, REFETCH_CHATS, chat.members);

  return res.status(200).json({
    success: true,
    message: "Group name changed successfully",
  });
});

const deleteChat = TryCatch(async (req, res, next) => {
  const chatId = req.params.Id;

  const chat = await Chat.findById(chatId);

  if (!chat) return next(new ErrorHandler("Chat not found", 404));

  const members = chat.members;

  if (chat.groupChat && chat.creator.toString() !== req.user.toString())
    return next(new ErrorHandler("Only Admin is allowed to delete chat", 403));

  if (!chat.groupChat && !members.includes(req.user.toString()))
    return next(new ErrorHandler("You are not allowed to delete chat", 403));

  // delete from cloudinary

  const messageWithAttachments = await Message.find({
    chat: chatId,
    attachments: { $exists: true, $ne: [] },
  });

  const public_ids = [];

  messageWithAttachments.forEach(({ attachments }) =>
    attachments.forEach(({ public_id }) => public_ids.push(public_id))
  );

  await Promise.all([
    deleteFilesFromCloudinary(public_ids),
    chat.deleteOne(),
    Message.deleteMany({ chat: chatId }),
  ]);

  emitEvent(req, REFETCH_CHATS, members);

  return res.status(200).json({
    success: true,
    message: "Chat deleted successfully",
  });
});

const getMessages = TryCatch(async (req, res, next) => {
  const chatId = req.params.Id;

  const { page = 1 } = req.query;

  const limit = 20;

  const skip = (page - 1) * limit;

  const [messages, totalMessages] = await Promise.all([
    Message.find({ chat: chatId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("sender", "name avatar")
      .lean(),
    Message.countDocuments({ chat: chatId }),
  ]);

  const totalPages = Math.ceil(totalMessages / limit);

  return res.status(200).json({
    success: true,
    messages: messages.reverse(),
    totalPages,
  });
});

export {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
  sendAttachments,
  getChatDetails,
  renameGroup,
  deleteChat,
  getMessages,
};
