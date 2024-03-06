import React, { useRef } from "react";
import AppLayout from "../components/Layout/AppLayout";
import { Box, IconButton, Stack } from "@mui/material";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/styles/styledComponents";
import FileMenu from "../components/styles/FileMenu";

const Chat = () => {
  const containerRef = useRef(null);
  const fileMenuRef = useRef(null);
  return (
    <Box padding={"0.25rem"} height={"100%"}>
      <Box height={"100%"} bgcolor={"rgba(0,0,0,0.05)"}>
        <Stack
          ref={containerRef}
          boxSizing={"border-box"}
          padding={"1rem"}
          spacing={"1rem"}
          height={"90%"}
          sx={{
            overflowX: "hidden",
            overflowY: "auto",
          }}
        ></Stack>
        <form style={{ height: "10%", paddingBottom: "0.25rem" }}>
          <Stack
            spacing={"0.5rem"}
            direction={"row"}
            height={"100%"}
            alignItems={"center"}
            position={"relative"}
          >
            <IconButton
              sx={{ position: "absolute", rotate: "30deg", left: "0.5rem" }}
              ref={fileMenuRef}
            >
              <AttachFileIcon />
            </IconButton>
            <InputBox placeholder="Write a message..." />
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
        <FileMenu anchor={fileMenuRef.current} />
      </Box>
    </Box>
  );
};

export default AppLayout()(Chat);
