import React, { useRef, useState } from "react";
import AppLayout from "../components/Layout/AppLayout";
import { Box, IconButton, Stack } from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/styles/styledComponents";
import FileMenu from "../components/dialog/FileMenu";
import { sampleMessages } from "../constants/SampleData";
import MessageComponent from "../components/shared/MessageComponent";
import { GetSocket } from "../socket";

const user = {
  _id: "mymsg",
  name: "sneh soni",
};

const Chat = () => {
  const containerRef = useRef(null);
  const [message, setMessage] = useState("");

  const socket = GetSocket();

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;
  };

  return (
    <Box paddingX={"0.25rem"} height={"100%"} width={"100%"}>
      <Box height={"100%"} width={"100%"} bgcolor={"rgba(0,0,0,0.05)"}>
        <Stack
          ref={containerRef}
          boxSizing={"border-box"}
          padding={"1rem"}
          spacing={"1rem"}
          height={"90%"}
          width={"100%"}
          sx={{
            overflowX: "hidden",
            overflowY: "auto",
          }}
        >
          {sampleMessages.map((message) => (
            <MessageComponent key={message._id} message={message} user={user} />
          ))}
        </Stack>
        <form
          style={{ height: "10%", paddingBottom: "0.25rem" }}
          onSubmit={submitHandler}
        >
          <Stack
            spacing={"0.5rem"}
            direction={"row"}
            height={"100%"}
            alignItems={"center"}
            position={"relative"}
          >
            <IconButton
              sx={{ position: "absolute", rotate: "30deg", left: "0.5rem" }}
            >
              <AttachFileIcon />
            </IconButton>
            <InputBox
              placeholder="Write a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <IconButton
              type="submit"
              size="small"
              sx={{
                backgroundColor: "warning.main",
                color: "white",
                padding: "0.5rem",
                "&:hover": {
                  backgroundColor: "warning.dark",
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Stack>
        </form>
        <FileMenu />
      </Box>
    </Box>
  );
};

export default AppLayout()(Chat);
