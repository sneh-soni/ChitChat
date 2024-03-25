import express from "express";
import {
  login,
  newUser,
  getMyProfile,
  logout,
  searchUser,
} from "../controllers/user.controller.js";
import { multerUpload } from "../middlewares/multer.middleware.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/newUser", multerUpload.single("avatar"), newUser);
router.post("/login", login);

router.use(isAuthenticated);

router.get("/me", getMyProfile);
router.get("/logout", logout);
router.get("/search", searchUser);

export default router;
