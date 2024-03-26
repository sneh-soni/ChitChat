import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const connectDB = async () => {
  try {
    const Connection = await mongoose.connect(`${process.env.MONGO_URI}`, {
      writeConcern: { w: "majority" },
    });
    console.log("Mongodb connected: ", Connection.connection.host);
  } catch (error) {
    console.log("Mongodb connection error: ", error);
    process.exit(1);
  }
};

const cookieOptions = {
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000,
  secure: true,
  sameSite: "none",
};

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  return res.status(code).cookie("Token", token, cookieOptions).json({
    success: true,
    message,
    user,
  });
};

const emitEvent = (req, event, users, data) => {
  console.log("Emmiting event: ", event);
};

const deleteFilesFromCloudinary = (public_ids) => {};

export {
  connectDB,
  sendToken,
  cookieOptions,
  emitEvent,
  deleteFilesFromCloudinary,
};
