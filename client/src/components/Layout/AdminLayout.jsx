import React, { useState } from "react";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  ManageAccounts as ManageAccountsIcon,
  Groups as GroupsIcon,
  Message as MessageIcon,
  ExitToApp as ExitToAppIcon,
} from "@mui/icons-material";
import { useLocation, Link as LinkComponent, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../redux/thunks/admin";

const Link = styled(LinkComponent)`
  text-decoration: none;
  color: black;
  padding: 1rem, 2rem;
  &:hover {
    background-color: rgba(0, 0, 0, 0.25);
  }
  border-radius: 1rem;
`;

const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/users-management",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Chats",
    path: "/admin/chats-management",
    icon: <GroupsIcon />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <MessageIcon />,
  },
];

const Sidebar = ({ w = "100%" }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const logoutHandler = () => {
    dispatch(adminLogout());
  };
  return (
    <Stack width={w} direction={"column"} padding={"1rem"}>
      <Typography textAlign={"center"} variant="h5" marginY={"1rem"}>
        Hey! <span style={{ color: "#0288d1" }}> Admin</span>
      </Typography>
      <Stack spacing={"1rem"}>
        {adminTabs.map((tab) => {
          return (
            <Link
              key={tab.path}
              to={tab.path}
              sx={{
                ...(location.pathname === tab.path && {
                  backgroundColor: "rgba(0,0,0,0.25)",
                }),
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
                borderRadius: "0.25rem",
                padding: "0.5rem",
                color: "black",
              }}
            >
              <Stack direction={"row"} spacing={"0.5rem"} alignItems={"center"}>
                {tab.icon}
                <Typography>{tab.name}</Typography>
              </Stack>
            </Link>
          );
        })}
        <Link
          onClick={logoutHandler}
          sx={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
            borderRadius: "0.25rem",
            padding: "0.5rem",
            color: "black",
          }}
        >
          <Stack direction={"row"} spacing={"0.5rem"} alignItems={"center"}>
            <ExitToAppIcon />
            <Typography>Logout</Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
};

const AdminLayout = ({ children }) => {
  const { isAdmin } = useSelector((store) => store.auth);
  const [isMobile, setIsMobile] = useState(false);

  const handleMobile = () => {
    setIsMobile(!isMobile);
  };
  const handleClose = () => {
    setIsMobile(false);
  };

  if (!isAdmin) return <Navigate to={"/admin"} />;

  return (
    <Grid container minHeight={"100vh"}>
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
        }}
      >
        <IconButton size="small" onClick={handleMobile}>
          {isMobile ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>
      <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
        <Sidebar w="100%" />
      </Grid>
      <Grid item xs={12} md={8} lg={9} sx={{ bgcolor: "#42a5f5" }}>
        {children}
      </Grid>
      <Drawer open={isMobile} onClose={handleClose}>
        <Sidebar w="60vw" />
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;
