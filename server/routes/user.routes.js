import express from "express";
import {
  login,
  newUser,
  getMyProfile,
  logout,
  searchUser,
  sendFriendRequest,
  acceptFriendRequest,
  getAllNotifications,
  getMyFriends,
} from "../controllers/user.controller.js";
import { multerUpload } from "../middlewares/multer.middleware.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  registerValidator,
  validateHandler,
  loginValidator,
  sendRequestValidator,
  acceptRequestValidator,
} from "../lib/validators.js";

const router = express.Router();

router.post(
  "/newUser",
  multerUpload.single("avatar"),
  registerValidator(),
  validateHandler,
  newUser
);
router.post("/login", loginValidator(), validateHandler, login);

router.use(isAuthenticated);

router.get("/me", getMyProfile);
router.get("/logout", logout);
router.get("/search", searchUser);
router.put(
  "/send-request",
  sendRequestValidator(),
  validateHandler,
  sendFriendRequest
);
router.put(
  "/accept-request",
  acceptRequestValidator(),
  validateHandler,
  acceptFriendRequest
);

router.get("/notifications", getAllNotifications);
router.get("/my-friends", getMyFriends);

export default router;
