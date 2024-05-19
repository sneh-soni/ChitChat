import { useFileHandler, useInputValidation } from "6pp";
import { CameraAlt, Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Container,
  FilledInput,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
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
import { userExists } from "../redux/reducers/auth";
import { passwordValidator, usernameValidator } from "../utils/validators";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const username = useInputValidation("", usernameValidator);
  const fullname = useInputValidation("");
  const bio = useInputValidation("");
  const password = useInputValidation("", passwordValidator);
  const avatar = useFileHandler("single");

  const dispatch = useDispatch();

  const handleClickShowPassword = () => setShowPass((show) => !show);

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
    <div
      style={{
        width: "100%",
        background: "linear-gradient(to right, #ff7e5f, #feb47b)",
      }}
    >
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
            padding: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          {isLogin ? (
            <Box textAlign={"center"}>
              <Typography variant="h5" fontFamily={"revert"}>
                <span style={{ color: "#d32f2f" }}>Hello</span> Again!
              </Typography>
              <Typography variant="caption" fontFamily={"revert"}>
                Welcome back you've been missed.
              </Typography>
              <form onSubmit={handleLogin}>
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="filled"
                  disabled={isLoading}
                  color="error"
                  value={username.value}
                  onChange={username.changeHandler}
                />
                <FormControl margin="normal" fullWidth variant="filled">
                  <InputLabel color="error">Password *</InputLabel>
                  <FilledInput
                    fullWidth
                    type={showPass ? "text" : "password"}
                    disabled={isLoading}
                    color="error"
                    value={password.value}
                    onChange={password.changeHandler}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                    marginTop: "0.5rem",
                  }}
                >
                  <Button
                    type="submit"
                    color="error"
                    variant="contained"
                    sx={{ marginTop: "0.5rem" }}
                    disabled={isLoading}
                  >
                    Log In
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    sx={{ marginTop: "0.5rem" }}
                    onClick={() => {
                      setIsLogin(false);
                      setShowPass(false);
                    }}
                    disabled={isLoading}
                  >
                    create an account
                  </Button>
                </Box>
              </form>
            </Box>
          ) : (
            <Box textAlign={"center"} maxHeight={"100%"}>
              <Typography variant="h5" fontFamily={"revert"}>
                Welcome to <span style={{ color: "#d32f2f" }}>ChitChat!</span>
              </Typography>
              <form onSubmit={handleSignup}>
                <Stack
                  position={"relative"}
                  width={"5rem"}
                  height={"5rem"}
                  marginX={"auto"}
                  marginY={"0.5rem"}
                >
                  <Avatar
                    sx={{
                      width: "5rem",
                      height: "5rem",
                      objectFit: "contain",
                    }}
                    src={avatar.preview}
                  />
                  {avatar.error && (
                    <Typography
                      fontSize={"0.65rem"}
                      display={"block"}
                      color="error"
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
                  label="Fullname"
                  disabled={isLoading}
                  sx={{ margin: "0.3rem 0" }}
                  variant="standard"
                  color="error"
                  value={fullname.value}
                  onChange={fullname.changeHandler}
                />
                <TextField
                  required
                  fullWidth
                  disabled={isLoading}
                  label="About yourself..."
                  color="error"
                  sx={{ margin: "0.3rem 0" }}
                  variant="standard"
                  value={bio.value}
                  onChange={bio.changeHandler}
                />
                <TextField
                  required
                  disabled={isLoading}
                  fullWidth
                  label="Username"
                  sx={{ margin: "0.3rem 0" }}
                  color="error"
                  variant="standard"
                  value={username.value}
                  onChange={username.changeHandler}
                />
                {username.error && (
                  <Typography
                    color="error"
                    sx={{ margin: "0", padding: "0" }}
                    fontSize={"0.65rem"}
                  >
                    {username.error}
                  </Typography>
                )}
                <FormControl
                  fullWidth
                  sx={{ margin: "0.3rem 0" }}
                  variant="standard"
                >
                  <InputLabel color="error">Password *</InputLabel>
                  <Input
                    fullWidth
                    type={showPass ? "text" : "password"}
                    disabled={isLoading}
                    color="error"
                    value={password.value}
                    onChange={password.changeHandler}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClickShowPassword}
                          edge="end"
                        >
                          {showPass ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
                {password.error && (
                  <Typography
                    color="error"
                    fontSize={"0.65rem"}
                    sx={{ margin: "0", padding: "0" }}
                  >
                    {password.error}
                  </Typography>
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "column",
                    marginTop: "0.5rem",
                  }}
                >
                  <Button
                    type="submit"
                    color="error"
                    variant="contained"
                    sx={{ marginTop: "0.5rem" }}
                    disabled={isLoading}
                  >
                    Create account
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    color="error"
                    sx={{ marginTop: "0.5rem" }}
                    onClick={() => {
                      setIsLogin(true);
                      setShowPass(false);
                    }}
                    disabled={isLoading}
                  >
                    log in
                  </Button>
                </Box>
              </form>
            </Box>
          )}
        </Paper>
      </Container>
    </div>
  );
};

export default Login;
