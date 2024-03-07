import React, { memo, useState } from "react";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  ListItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { HEADER_COLOR } from "../constants/ColorConstants";
import {
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Link } from "../components/styles/styledComponents";
import { useNavigate, useSearchParams } from "react-router-dom";
import AvatarCard from "../components/shared/AvatarCard";
import { sampleChat } from "../constants/SampleData";

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
    >
      <ListItem
        divider
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          borderRadius: "0.2rem",
          padding: "0.5rem",
          backgroundColor: "rgba(0,0,0,0.25)",
          color: "black",
        }}
      >
        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
          <AvatarCard avatar={avatar} />
          <Typography fontSize={"1.2rem"}>{name}</Typography>
        </Stack>
      </ListItem>
    </Link>
  );
});

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => {
  return (
    <Stack width={w}>
      {myGroups.length > 0 ? (
        myGroups.map((group) => (
          <GroupListItem group={group} chatId={chatId} key={group._id} />
        ))
      ) : (
        <Typography textAlign={"center"} padding={"1rem"}>
          No Groups
        </Typography>
      )}
    </Stack>
  );
};

const Groups = () => {
  const navigate = useNavigate();
  const chatId = useSearchParams()[0].get("group");
  console.log("chatId:", chatId);
  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const handleMobile = () => {};
  const navigateBack = () => {
    navigate("/");
  };
  const IconBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            top: "1rem",
            right: "1rem",
          },
        }}
      >
        <IconButton onClick={() => setIsMobileMenu((prev) => !prev)}>
          <MenuIcon />
        </IconButton>
      </Box>
      <Tooltip title="Back">
        <IconButton
          sx={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            backgroundColor: "rgba(0,0,0,0.8)",
            ":hover": {
              backgroundColor: "rgba(0,0,0,0.85)",
            },
            color: "white",
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );
  return (
    <Grid container height={"100vh"}>
      <Grid
        item
        sm={4}
        bgcolor={HEADER_COLOR}
        sx={{ display: { xs: "none", sm: "block" } }}
      >
        <GroupsList myGroups={sampleChat} chatId={""} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem 3rem",
          position: "relative",
        }}
      >
        {IconBtns}
        group details
      </Grid>
      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
        open={isMobileMenu}
        onClose={() => setIsMobileMenu(false)}
      >
        <GroupsList w={"70vw"} myGroups={sampleChat} chatId={""} />
      </Drawer>
    </Grid>
  );
};

export default Groups;
