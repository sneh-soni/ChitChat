import { Box, Stack, Typography } from "@mui/material";
import { motion } from "framer-motion";
import moment from "moment";
import React from "react";
import { fileFormat } from "../../utils/features";
import RenderAttachment from "./RenderAttachment";

const MessageComponent = ({ message, user }) => {
  const { content, sender, attachments = [], createdAt } = message;
  const sameSender = sender?._id === user._id;
  const timeAgo = moment(createdAt).fromNow();
  return (
    <motion.div
      initial={{ opacity: 0, x: "-100%" }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: sameSender ? "rgba(0,0,0,0.1)" : "#42a5f5",
        borderRadius: "0.25rem",
        color: "black",
        width: attachments.length > 0 ? "45%" : "fit-content",
        maxWidth: "45%",
        height: "fit-content",
        overflowWrap: "break-word",
        wordBreak: "break-word",
        fontSize: "0.9rem",
      }}
    >
      {!sameSender && (
        <Typography
          backgroundColor={"rgba(0,0,0,0.25)"}
          paddingX={"0.25rem"}
          paddingY={"0.1rem"}
          fontSize={"0.6rem"}
          color={"white"}
          borderRadius={"0.25rem"}
        >
          {sender.name}
        </Typography>
      )}
      {content && (
        <Typography paddingX={"0.5rem"} paddingY={"0.25rem"}>
          {content}
        </Typography>
      )}

      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);

          return (
            <Box
              width={"100%"}
              paddingX={"0.5rem"}
              paddingY={"0.25rem"}
              key={index}
            >
              <a
                href={url}
                target="_blank"
                download
                style={{
                  color: "black",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {RenderAttachment(file, url)}
              </a>
            </Box>
          );
        })}

      <Stack direction={"row"} alignItems={"center"}>
        <Typography
          paddingX={"0.25rem"}
          paddingY={"0.1rem"}
          sx={{
            fontSize: "0.6rem",
            wordSpacing: "-0.1em",
          }}
        >
          {timeAgo}
        </Typography>
      </Stack>
    </motion.div>
  );
};

export default MessageComponent;
