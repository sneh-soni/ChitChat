import { useFileHandler, useInputValidation, useStrongPassword } from "6pp";
import { CameraAlt } from "@mui/icons-material";
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
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { VisuallyHiddenInput } from "../components/styles/styledComponents";
import { LOGIN_PAGE_BG_STYLES } from "../constants/BackgroundConstants";
import { userExists } from "../redux/reducers/auth";
import { usernameValidator } from "../utils/validators";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const username = useInputValidation("", usernameValidator);
  const fullname = useInputValidation("");
  const bio = useInputValidation("");
  const password = useStrongPassword();
  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Logging in...");
    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + `/api/v1/users/login`,
        {
          username: username.value,
          password: password.value,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Signing up...");
    const formData = new FormData();
    formData.append("username", username.value);
    formData.append("fullname", fullname.value);
    formData.append("password", password.value);
    formData.append("avatar", avatar.file);
    formData.append("bio", bio.value);

    try {
      const { data } = await axios.post(
        process.env.REACT_APP_SERVER + `/api/v1/users/newUser`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong", {
        id: toastId,
      });
    } finally {
      setIsLoading(false);
    }
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
                  variant="filled"
                  disabled={isLoading}
                  color="warning"
                  value={username.value}
                  onChange={username.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  type="password"
                  label="password"
                  margin="normal"
                  disabled={isLoading}
                  color="warning"
                  variant="filled"
                  value={password.value}
                  onChange={password.changeHandler}
                />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    variant="outlined"
                    color="warning"
                    sx={{ marginTop: "1rem" }}
                    onClick={() => setIsLogin(false)}
                    disabled={isLoading}
                  >
                    register
                  </Button>
                  <Button
                    type="submit"
                    color="warning"
                    variant="contained"
                    sx={{ marginTop: "1rem" }}
                    disabled={isLoading}
                  >
                    sign in
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div style={{ maxHeight: "100vh" }}>
              <Typography
                textAlign={"center"}
                variant="h5"
                sx={{ marginBottom: "0.25rem" }}
              >
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
                      fontSize={"0.65rem"}
                      width={"100%"}
                      display={"block"}
                      color="error"
                      variant="caption"
                    >
                      *{avatar.error}
                    </Typography>
                  )}
                  <IconButton
                    sx={{
                      position: "absolute",
                      bottom: "0",
                      right: "0",
                      color: "gray",
                      bgcolor: "white",
                    }}
                    component="label"
                  >
                    <>
                      <CameraAlt />
                      <VisuallyHiddenInput
                        type="file"
                        disabled={isLoading}
                        onChange={avatar.changeHandler}
                      />
                    </>
                  </IconButton>
                </Stack>
                <TextField
                  required
                  fullWidth
                  label="fullname"
                  disabled={isLoading}
                  margin="normal"
                  variant="standard"
                  color="warning"
                  value={fullname.value}
                  onChange={fullname.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  disabled={isLoading}
                  label="something about yourself"
                  color="warning"
                  margin="normal"
                  variant="standard"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
                <TextField
                  required
                  disabled={isLoading}
                  fullWidth
                  label="username"
                  margin="normal"
                  color="warning"
                  variant="standard"
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
                  type="password"
                  label="password"
                  disabled={isLoading}
                  color="warning"
                  margin="normal"
                  variant="standard"
                  value={password.value}
                  onChange={password.changeHandler}
                />
                {password.error && (
                  <Typography color="error" variant="caption">
                    {password.error}
                  </Typography>
                )}
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Button
                    variant="outlined"
                    color="warning"
                    sx={{ marginTop: "1rem" }}
                    onClick={() => setIsLogin(true)}
                    disabled={isLoading}
                  >
                    login
                  </Button>
                  <Button
                    type="submit"
                    color="warning"
                    variant="contained"
                    sx={{ marginTop: "1rem" }}
                    disabled={isLoading}
                  >
                    sign up
                  </Button>
                </div>
              </form>
            </div>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
