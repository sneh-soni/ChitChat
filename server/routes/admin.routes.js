import express from "express";
import {
  getAllUsers,
  getAllChats,
  getAllMessages,
  getDashboardStats,
  adminLogin,
  adminLogout,
  getIsAdmin,
} from "../controllers/admin.controller.js";
import { isAdmin } from "../middlewares/auth.js";
import { adminLoginValidator, validateHandler } from "../lib/validators.js";

const router = express.Router();

router.post("/admin-login", adminLoginValidator(), validateHandler, adminLogin);
router.post("/admin-logout", adminLogout);

router.use(isAdmin);

router.get("/", getIsAdmin);
router.get("/all-users", getAllUsers);
router.get("/all-chats", getAllChats);
router.get("/all-messages", getAllMessages);
router.get("/stats", getDashboardStats);

export default router;
