import {
  AppBar,
  Backdrop,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Suspense, lazy, startTransition, useState } from "react";
import { HEADER_COLOR } from "../../constants/ColorConstants.js";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ChatIcon from "../../constants/LogoSvg.jsx";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { userNotExists } from "../../redux/reducers/auth.js";
import {
  setIsMobile,
  setIsSearch,
  setIsNotification,
} from "../../redux/reducers/misc.js";

const SearchDialog = lazy(() => import("../specific/Search.jsx"));
const NotificationsDialog = lazy(() => import("../specific/Notifications.jsx"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup.jsx"));

const IconBtn = ({ title, onClick, icon }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="#000" size="medium" onClick={onClick}>
        {icon}
      </IconButton>
    </Tooltip>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSearch, isNotification } = useSelector((store) => store.misc);

  const handleMobile = () => dispatch(setIsMobile(true));
  const openNotification = () => dispatch(setIsNotification(true));
  const openSearch = () => dispatch(setIsSearch(true));

  const openNewGroup = () => {
    setIsNewGroup((prev) => !prev);
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(
        process.env.REACT_APP_SERVER + "/api/v1/users/logout",
        {
          withCredentials: true,
        }
      );

      toast.success(data.message);
      dispatch(userNotExists());
    } catch (error) {
      toast(error?.response?.data?.message || "Something went wrong");
    }
  };

  const navigateToGroups = () => {
    startTransition(() => {
      navigate("/groups");
    });
  };

  const [isNewGroup, setIsNewGroup] = useState(false);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            bgcolor: HEADER_COLOR,
            height: "3.2rem",
            justifyContent: "center",
          }}
        >
          <Toolbar>
            <Typography
              variant="h6"
              sx={{
                display: {
                  xs: "none",
                  sm: "flex",
                  gap: "8px",
                  color: "black",
                },
                fontFamily: "monospace",
                fontWeight: "bold",
              }}
            >
              <ChatIcon />
              ChitChat
            </Typography>
            <Box sx={{ display: { xs: "block", sm: "none" } }}>
              <IconBtn
                title={"Menu"}
                onClick={handleMobile}
                icon={<MenuIcon />}
              />
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              <IconBtn
                title={"Search"}
                onClick={openSearch}
                icon={<SearchIcon />}
              />
              <IconBtn
                title={"New Group"}
                onClick={openNewGroup}
                icon={<AddIcon />}
              />
              <IconBtn
                title={"Manage Groups"}
                onClick={navigateToGroups}
                icon={<GroupIcon />}
              />
              <IconBtn
                title={"Notifications"}
                onClick={openNotification}
                icon={<NotificationsIcon />}
              />
              <IconBtn
                title={"Logout"}
                onClick={logoutHandler}
                icon={<LogoutIcon />}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}
      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotificationsDialog />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog />
        </Suspense>
      )}
    </>
  );
};

export default Header;
