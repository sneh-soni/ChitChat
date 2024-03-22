import express from "express";
import { login, newUser } from "../controllers/user.controller.js";
import { multerUpload } from "../middlewares/multer.middleware.js";

const router = express.Router();

router.post("/newUser", multerUpload.single("avatar"), newUser);
router.post("/login", login);

export default router;
