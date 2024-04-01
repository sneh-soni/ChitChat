import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
import { getBase64 } from "../lib/helpers.js";

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

const uploadFilesToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);

    const formattedResults = results.map((result) => {
      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    });

    return formattedResults;
  } catch (error) {
    throw new Error("Something went wrong while uploading file(s)", 500);
  }
};

const deleteFilesFromCloudinary = async (public_ids) => {};

export {
  connectDB,
  sendToken,
  cookieOptions,
  emitEvent,
  uploadFilesToCloudinary,
  deleteFilesFromCloudinary,
};
