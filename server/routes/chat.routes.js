import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembers,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.use(isAuthenticated);

router.post("/new", newGroupChat);
router.get("/my/chats", getMyChats);
router.get("/my/groups", getMyGroups);
router.put("/addmembers", addMembers);

export default router;
