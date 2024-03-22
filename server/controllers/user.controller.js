import { TryCatch } from "../middlewares/error.middleware.js";
import { User } from "../models/user.model.js";
import { sendToken } from "../utils/features.js";
import { compare } from "bcrypt";

const newUser = async (req, res) => {
  const { name, username, password, bio } = req.body;

  const avatar = {
    public_id: "one",
    url: "one",
  };

  const user = await User.create({
    name,
    bio,
    username,
    password,
    avatar,
  });

  sendToken(res, user, 201, "User created Successfully");
};

const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user) return next(new Error("Invalid Username"));

  const isMatch = await compare(password, user.password);

  if (!isMatch) return next(new Error("Incorrect Password"));

  sendToken(res, user, 201, "User logged in Successfully");
});

export { newUser, login };
