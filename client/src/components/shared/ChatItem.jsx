import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import React, { memo } from "react";
import { Link } from "../styles/styledComponents";
import AvatarCard from "./AvatarCard";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  return (
    <Link
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        style={{
          display: "flex",
          gap: "1rem",
          position: "relative",
          alignItems: "center",
          padding: "0.5rem",
          backgroundColor: sameSender ? "rgba(0,0,0,0.2)" : "unset",
          color: "black",
        }}
      >
        <AvatarCard avatar={avatar} />

        <Stack>
          <Typography>{name}</Typography>
          {newMessageAlert && (
            <Typography fontSize={"0.65rem"}>
              {newMessageAlert.count}{" "}
              {newMessageAlert.count > 1 ? "New Messages" : "New Message"}
            </Typography>
          )}
        </Stack>
        {isOnline && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              right: "0.5rem",
              width: "0.5rem",
              height: "0.5rem",
              borderRadius: "50%",
              backgroundColor: "green",
              transform: "translateY(-50%)",
            }}
          />
        )}
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);
