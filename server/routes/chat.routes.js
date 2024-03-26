import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
  removeMember,
  leaveGroup,
  getChatDetails,
  sendAttachments,
  renameGroup,
  deleteChat,
  getMessages,
} from "../controllers/chat.controller.js";
import { multerUpload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/new", newGroupChat);
router.get("/my/chats", getMyChats);
router.get("/my/groups", getMyGroups);
router.put("/addmembers", addMembers);
router.delete("/removemember", removeMember);
router.delete("/leave/:Id", leaveGroup);
router.post("/message", multerUpload.array("attachments", 5), sendAttachments);
router.get("/messages/:Id", getMessages);
router.route("/:Id").get(getChatDetails).put(renameGroup).delete(deleteChat);

export default router;
