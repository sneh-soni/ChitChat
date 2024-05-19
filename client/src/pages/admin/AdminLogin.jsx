import { useInputValidation } from "6pp";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { adminLogin, getAdmin } from "../../redux/thunks/admin";

const AdminLogin = () => {
  const navigate = useNavigate();
  const secretKey = useInputValidation("");
  const dispatch = useDispatch();

  const { isAdmin } = useSelector((store) => store.auth);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(adminLogin(secretKey.value));
  };

  useEffect(() => {
    dispatch(getAdmin());
  }, [dispatch]);

  if (isAdmin) return <Navigate to={"/admin/dashboard"} />;

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
            minWidth: { sm: "20rem" },
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          <Typography variant="h5" fontFamily={"revert"}>
            <span style={{ color: "#d32f2f" }}>Admin </span>Login
          </Typography>
          <form style={{ width: "100%" }} onSubmit={submitHandler}>
            <TextField
              required
              fullWidth
              type="password"
              label="Enter your key"
              margin="normal"
              color="error"
              variant="outlined"
              value={secretKey.value}
              onChange={secretKey.changeHandler}
            />
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexDirection: "column",
              }}
            >
              <Button
                type="submit"
                color="error"
                variant="contained"
                sx={{ marginTop: "0.5rem" }}
              >
                Log in
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                sx={{ marginTop: "0.5rem" }}
                onClick={() => navigate("/")}
              >
                Back to Home
              </Button>
            </Box>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;
