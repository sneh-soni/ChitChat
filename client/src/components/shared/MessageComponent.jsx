import { Box, IconButton, Stack, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import { AvTimer } from "@mui/icons-material";
import { fileFormat } from "../../utils/features";
import RenderAttachment from "./RenderAttachment";

const MessageComponent = ({ message, user }) => {
  const { content, sender, attachments = [], createdAt } = message;
  const sameSender = sender?._id === user._id;
  const timeAgo = moment(createdAt).fromNow();
  return (
    <div
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "rgba(0,0,0,0.2)",
        padding: "0.3rem",
        borderRadius: "0.25rem",
        color: "black",
        maxWidth: "40%",
        height: "fit-content",
        overflowWrap: "break-word",
        wordBreak: "break-word",
        fontSize: "0.9rem",
      }}
    >
      {!sameSender && (
        <Typography
          backgroundColor={"rgba(0,0,0,0.5)"}
          variant="caption"
          paddingY={"0.2rem"}
          paddingX={"0.5rem"}
          color={"white"}
          borderRadius={"0.5rem"}
        >
          {sender.name}
        </Typography>
      )}
      {content && <Typography>{content}</Typography>}

      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);

          return (
            <Box key={index}>
              <a href="" target="_blank" download style={{ color: "black" }}>
                {RenderAttachment(file, url)}
              </a>
            </Box>
          );
        })}

      <Stack direction={"row"} alignItems={"center"}>
        <AvTimer
          sx={{
            width: "0.8rem",
          }}
        />
        <Typography
          paddingX={"0.25rem"}
          variant="caption"
          sx={{
            fontSize: "0.6rem",
            wordSpacing: "-0.1em",
          }}
        >
          {timeAgo}
        </Typography>
      </Stack>
    </div>
  );
};

export default MessageComponent;