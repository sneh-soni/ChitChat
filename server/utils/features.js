import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const Connection = await mongoose.connect(
      `${process.env.MONGO_URI}/chitchat`,
      {
        writeConcern: { w: "majority" },
      }
    );
    console.log("Mongodb connected: ", Connection.connection.host);
  } catch (error) {
    console.log("Mongodb connection error: ", error);
    process.exit(1);
  }
};

export { connectDB };
