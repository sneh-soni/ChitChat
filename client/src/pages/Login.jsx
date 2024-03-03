import React, { useState } from "react";
import {
  Avatar,
  Button,
  Container,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import { VisuallyHiddenInput } from "../components/styles/styledComponents";
import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import { usernameValidator } from "../utils/validators";
import { LOGIN_PAGE_BG_STYLES } from "../utils/constants";

const Login = () => {
  const [isLogin, setIsLogin] = useState(false);
  const username = useInputValidation("", usernameValidator);
  const fullname = useInputValidation("");
  const bio = useInputValidation("");
  const password = useStrongPassword();
  const avatar = useFileHandler("single");

  const handleLogin = (e) => {
    e.preventDefault();
  };
  const handleSignup = (e) => {
    e.preventDefault();
  };

  return (
    <div style={LOGIN_PAGE_BG_STYLES}>
      <Container
        component={"main"}
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {isLogin ? (
            <>
              <Typography variant="h5">Login</Typography>
              <form onSubmit={handleLogin}>
                <TextField
                  required
                  fullWidth
                  label="username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  type="password"
                  label="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />
                <div className="flex justify-between">
                  <Button
                    variant="outlined"
                    sx={{ marginTop: "1rem" }}
                    onClick={() => setIsLogin(false)}
                  >
                    register
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    sx={{ marginTop: "1rem" }}
                  >
                    sign in
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5" sx={{ marginBottom: "0.5rem" }}>
                Register
              </Typography>
              <form onSubmit={handleSignup}>
                <Stack
                  position={"relative"}
                  width={"6rem"}
                  height={"6rem"}
                  margin={"auto"}
                >
                  <Avatar
                    sx={{
                      width: "6rem",
                      height: "6rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />
                  {avatar.error && (
                    <Typography
                      m={"1rem auto"}
                      width={"fit-content"}
                      display={"block"}
                      color="error"
                      variant="caption"
                    >
                      {avatar.error}
                    </Typography>
                  )}
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "black",
                      bgcolor: "white",
                    }}
                    component="label"
                  >
                    <>
                      <CameraAlt />
                      <VisuallyHiddenInput
                        type="file"
                        onChange={avatar.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>
                <TextField
                  required
                  fullWidth
                  label="fullname"
                  margin="normal"
                  variant="outlined"
                  value={fullname.value}
                  onChange={fullname.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  label="username"
                  margin="normal"
                  variant="outlined"
                  value={username.value}
                  onChange={username.changeHandler}
                />
                {username.error && (
                  <Typography color="error" variant="caption">
                    {username.error}
                  </Typography>
                )}
                <TextField
                  required
                  fullWidth
                  label="bio"
                  margin="normal"
                  variant="outlined"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  type="password"
                  label="password"
                  margin="normal"
                  variant="outlined"
                  value={password.value}
                  onChange={password.changeHandler}
                />
                {password.error && (
                  <Typography color="error" variant="caption">
                    {password.error}
                  </Typography>
                )}
                <div className="flex justify-between">
                  <Button
                    variant="outlined"
                    sx={{ marginTop: "1rem" }}
                    onClick={() => setIsLogin(true)}
                  >
                    login
                  </Button>
                  <Button
                    type="submit"
                    color="primary"
                    variant="contained"
                    sx={{ marginTop: "1rem" }}
                  >
                    sign up
                  </Button>
                </div>
              </form>
            </>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
