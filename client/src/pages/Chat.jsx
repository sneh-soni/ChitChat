import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { Box, IconButton, Skeleton, Stack } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import AppLayout from "../components/Layout/AppLayout";
import FileMenu from "../components/dialog/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import { InputBox } from "../components/styles/styledComponents";
import { NEW_MESSAGE } from "../constants/events";
import { useDispatch } from "react-redux";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { GetSocket } from "../socket";
import { useInfiniteScrollTop } from "6pp";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";

const Chat = ({ chatId, user }) => {
  const containerRef = useRef(null);
  const socket = GetSocket();
  const dispatch = useDispatch();

  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState([]);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk?.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk?.data?.messages
  );

  const allMessages = [...oldMessages, ...messages];
  const members = chatDetails.data?.chat?.members;
  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    socket.emit(NEW_MESSAGE, { chatId, members, message });

    setMessage("");
  };

  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  useEffect(() => {
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
    };
  }, [chatId]);

  const newMessageHandler = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const eventsArr = { [NEW_MESSAGE]: newMessageHandler };
  useSocketEvents(socket, eventsArr);
  useErrors(errors);

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
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
          {allMessages.map((message, index) => (
            <MessageComponent
              key={message._id || index}
              message={message}
              user={user}
            />
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
              onClick={handleFileOpen}
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
        <FileMenu anchor={fileMenuAnchor} chatId={chatId} />
      </Box>
    </Box>
  );
};

export default AppLayout()(Chat);
