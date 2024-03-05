import React from "react";
import Header from "./Header";
import Title from "../shared/Title";
import { Grid } from "@mui/material";
import ChatList from "../specific/ChatList";
import { sampleChat } from "../../constants/SampleData";
import { useParams } from "react-router-dom";

const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams(); // error //
    const chatId = params.chatId;

    const handleDeleteChat = () => {};
    return (
      <>
        <Title />
        <Header />
        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
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
            }}
          >
            2
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
