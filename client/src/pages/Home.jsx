import React from "react";
import AppLayout from "../components/Layout/AppLayout";
import { Box, Typography } from "@mui/material";

const Home = () => {
  return (
    <Box height={"100%"} padding={"0.25rem"}>
      <Box height={"100%"} bgcolor={"rgba(0,0,0,0.05)"}>
        <Typography padding={"2rem"} textAlign={"center"}>
          Select a chat to start messaging
        </Typography>
      </Box>
    </Box>
  );
};

export default AppLayout()(Home);
