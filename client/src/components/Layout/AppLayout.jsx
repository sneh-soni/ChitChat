import React from "react";
import Header from "./Header";
import Title from "../shared/Title";
import { Grid } from "@mui/material";
import ChatList from "../specific/ChatList";
import { sampleChat } from "../../constants/SampleData";
import { useParams } from "react-router-dom";
import Profile from "../specific/Profile";
import { useMyChatsQuery } from "../../redux/api/api";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams();
    const chatId = params.chatId;

    const { isLoading, data, isError, error, refetch } = useMyChatsQuery();

    console.log("data: ", data);

    const handleDeleteChat = () => {};
    return (
      <>
        <Title />
        <Header />
        <Grid container height={"calc(100vh - 3.2rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
            borderRight={"1px solid rgba(0,0,0,0.25)"}
          >
            <ChatList
              chats={sampleChat}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
            />
          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent {...props} />
          </Grid>
          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              position: "relative",
              backgroundColor: "rgba(0,0,0,0.85)",
              borderRadius: "0.2rem",
            }}
          >
            <Profile />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
