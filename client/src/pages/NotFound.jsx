import React from "react";
import { ErrorOutline as ErrorIcon } from "@mui/icons-material";
import { Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container>
      <Stack
        maxWidth="lg"
        style={{ height: "100vh" }}
        alignItems={"center"}
        spacing={"0.5rem"}
        justifyContent={"center"}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={"0.5rem"}>
          <ErrorIcon color="error" sx={{ fontSize: "5rem" }} />
          <Typography variant="h3">404</Typography>
        </Stack>
        <Typography variant="h5">Page Not Found</Typography>
        <Link to={"/"} style={{ fontSize: "0.8rem" }}>
          Go Back to Home
        </Link>
      </Stack>
    </Container>
  );
};

export default NotFound;
