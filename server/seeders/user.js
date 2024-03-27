import { User } from "../models/user.model.js";
import { faker, simpleFaker } from "@faker-js/faker";
import { Chat } from "../models/chat.model.js";
import { Message } from "../models/message.model.js";

const createUser = async (numUsers) => {
  try {
    const userPromises = [];

    for (let i = 0; i < numUsers; i++) {
      const tempUser = User.create({
        name: faker.person.fullName(),
        username: faker.internet.userName(),
        password: "password",
        bio: faker.lorem.sentence(10),
        avatar: {
          url: faker.image.avatar(),
          public_id: faker.system.fileName(),
        },
      });
      userPromises.push(tempUser);
    }
    await Promise.all(userPromises);
    process.exit(1);
  } catch (error) {
    process.exit(1);
  }
};

const createSingleChats = async (numChats) => {
  try {
    const users = await User.find().select("_id");

    const chatPromises = [];

    for (let i = 0; i < users.length; i++) {
      for (let j = i + 1; j < users.length; j++) {
        chatPromises.push(
          Chat.create({
            name: faker.lorem.words(2),
            members: [users[i], users[j]],
          })
        );
      }
    }

    await Promise.all(chatPromises);

    process.exit();
  } catch (error) {
    process.exit(1);
  }
};
const createGroupChats = async (numChats) => {
  try {
    const users = await User.find().select("_id");

    const chatPromises = [];

    for (let i = 0; i < numChats; i++) {
      const numMembers = simpleFaker.number.int({ min: 3, max: users.length });

      const members = [];
      for (let j = 0; j < numMembers; j++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        if (!members.includes(randomUser)) {
          members.push(randomUser);
        }
      }
      const chat = Chat.create({
        groupChat: true,
        name: faker.lorem.words(1),
        members,
        creator: members[0],
      });

      chatPromises.push(chat);
    }

    await Promise.all(chatPromises);

    process.exit();
  } catch (error) {
    process.exit(1);
  }
};

const createMessages = async (numMessages) => {
  try {
    const users = await User.find().select("_id");
    const chats = await Chat.find().select("_id");

    const messagePromises = [];

    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomChat = chats[Math.floor(Math.random() * chats.length)];

      messagePromises.push(
        Message.create({
          chat: randomChat,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }
    await Promise.all(messagePromises);
    process.exit();
  } catch (error) {
    process.exit(1);
  }
};

const createMessagesInChat = async (chatId, numMessages) => {
  try {
    const users = await User.find().select("_id");

    const messagePromises = [];

    for (let i = 0; i < numMessages; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];

      messagePromises.push(
        Message.create({
          chat: chatId,
          sender: randomUser,
          content: faker.lorem.sentence(),
        })
      );
    }
    await Promise.all(messagePromises);
    process.exit();
  } catch (error) {
    process.exit(1);
  }
};

export {
  createUser,
  createSingleChats,
  createGroupChats,
  createMessages,
  createMessagesInChat,
};
