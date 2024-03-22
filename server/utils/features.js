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

const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  return res
    .status(code)
    .cookie("Token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message,
      user,
    });
};

export { connectDB, sendToken };
