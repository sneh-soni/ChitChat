import { TryCatch } from "../middlewares/error.middleware.js";
import { User } from "../models/user.model.js";
import { sendToken } from "../utils/features.js";
import { compare } from "bcrypt";
import { ErrorHandler } from "../utils/utility.js";
import { cookieOptions } from "../utils/features.js";

const newUser = TryCatch(async (req, res) => {
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
});

const login = TryCatch(async (req, res, next) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid Username", 401));

  const isMatch = await compare(password, user.password);

  if (!isMatch) return next(new ErrorHandler("Incorrect Password", 401));

  sendToken(res, user, 201, "User logged in Successfully");
});

const getMyProfile = async (req, res) => {
  const user = await User.findById(req.user);

  res.status(200).json({
    success: true,
    user,
  });
};

const logout = TryCatch(async (req, res) => {
  return res
    .status(200)
    .cookie("Token", "", {
      ...cookieOptions,
      maxAge: 0,
    })
    .json({
      success: true,
      message: "User logged out",
    });
});

const searchUser = TryCatch(async (req, res) => {
  const { name } = req.query;
  return res.status(200).json({
    success: true,
    message: name,
  });
});

export { newUser, login, getMyProfile, logout, searchUser };
