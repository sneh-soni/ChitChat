import React, { memo } from "react";
import { Link } from "../styles/styledComponents";
import { Box, Stack, Typography } from "@mui/material";
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
      <div
        style={{
          display: "flex",
          gap: "1rem",
          position: "relative",
          alignItems: "center",
          borderRadius: "0.2rem",
          padding: "0.5rem",
          backgroundColor: sameSender ? "black" : "unset",
          color: sameSender ? "white" : "unset",
        }}
      >
        <AvatarCard avatar={avatar} />

        <Stack>
          <Typography>{name}</Typography>
          {newMessageAlert && (
            <Typography>
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
      </div>
    </Link>
  );
};

export default memo(ChatItem);
