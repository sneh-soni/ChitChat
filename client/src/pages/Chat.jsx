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
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";
import { useDispatch } from "react-redux";
import { useErrors, useSocketEvents } from "../hooks/hook";
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";
import { GetSocket } from "../socket";
import { useInfiniteScrollTop } from "6pp";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/Layout/Loaders";
import { useNavigate } from "react-router-dom";

const Chat = ({ chatId, user }) => {
  const socket = GetSocket();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const containerRef = useRef(null);
  const typingTimeout = useRef(null);
  const bottomRef = useRef(null);

  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState([]);
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

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

  const messageChangeHandler = (e) => {
    setMessage(e.target.value);

    if (!isTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIsTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIsTyping(false);
    }, [2000]);
  };

  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));
    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({
        behavior: "smooth",
      });
  }, [messages]);

  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  const newMessageListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );

  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  const alertListener = useCallback(
    (data) => {
      console.log("alert", data);
      if (data.chatId !== chatId) return;
      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "randomId",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  const eventsArr = {
    [NEW_MESSAGE]: newMessageListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
    [ALERT]: alertListener,
  };
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
          {userTyping && <TypingLoader />}
          <div ref={bottomRef} />
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
              onChange={messageChangeHandler}
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
