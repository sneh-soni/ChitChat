import { User } from "../models/user.model.js";

const newUser = async (req, res) => {
  const avatar = {
    public_id: "one",
    url: "one",
  };

  await User.create({
    name: "one",
    username: "one",
    password: "<PASSWORD>",
    avatar: avatar,
  });

  return res.status(201).json({ message: "User Created Successfully" });
};

export { newUser };
