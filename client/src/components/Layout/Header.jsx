import {
  Add as AddIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { Suspense, lazy, startTransition } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ChatIcon from "../../constants/LogoSvg.jsx";
import { userNotExists } from "../../redux/reducers/auth.js";
import { resetNotification } from "../../redux/reducers/chat.js";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc.js";

const SearchDialog = lazy(() => import("../specific/Search.jsx"));
const NotificationsDialog = lazy(() => import("../specific/Notifications.jsx"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup.jsx"));

const IconBtn = ({ title, onClick, icon, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="#000000" size="medium" onClick={onClick}>
        {value ? (
          <Badge badgeContent={value} color="error">
            {" "}
            {icon}{" "}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
};

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isSearch, isNotification, isNewGroup } = useSelector(
    (store) => store.misc
  );
  const { notificationCount } = useSelector((store) => store.chat);

  const handleMobile = () => dispatch(setIsMobile(true));

  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotification());
  };
  const openSearch = () => dispatch(setIsSearch(true));

  const openNewGroup = () => dispatch(setIsNewGroup(true));

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

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar
          position="static"
          sx={{
            background: "#1976d2",
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
                  gap: "0.5rem",
                  alignItems: "center",
                },
                fontFamily: "revert-layer",
                color: "white",
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
                value={notificationCount}
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
