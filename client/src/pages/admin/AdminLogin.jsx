import { useInputValidation } from "6pp";
import { Button, Container, Paper, TextField, Typography } from "@mui/material";
import React from "react";
import { ADMIN_LOGIN_PAGE_BG_STYLES } from "../../constants/BackgroundConstants";
import { Navigate, useNavigate } from "react-router-dom";

const isAdmin = true;

const AdminLogin = () => {
  const navigate = useNavigate();
  const secretKey = useInputValidation("");

  const submitHandler = (e) => {
    e.preventDefault();
  };

  if (isAdmin) return <Navigate to={"/admin/dashboard"} />;
  return (
    <div style={ADMIN_LOGIN_PAGE_BG_STYLES}>
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
            minWidth: { sm: "20rem" },
          }}
        >
          <Typography variant="h5">Admin Login</Typography>
          <form style={{ width: "100%" }} onSubmit={submitHandler}>
            <TextField
              required
              fullWidth
              type="password"
              label="Enter your key"
              margin="normal"
              color="warning"
              variant="outlined"
              value={secretKey.value}
              onChange={secretKey.changeHandler}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Button
                variant="outlined"
                color="warning"
                sx={{ marginTop: "1rem" }}
                onClick={() => navigate("/")}
              >
                Back
              </Button>
              <Button
                type="submit"
                color="warning"
                variant="contained"
                sx={{ marginTop: "1rem" }}
              >
                Log in
              </Button>
            </div>
          </form>
        </Paper>
      </Container>
    </div>
  );
};

export default AdminLogin;
