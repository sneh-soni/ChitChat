import {
  CalendarMonth as CalendarIcon,
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
} from "@mui/icons-material";
import { Avatar, Divider, Stack, Typography } from "@mui/material";
import moment from "moment";
import React from "react";
import { transformImage } from "../../utils/features";

const ProfileCard = ({ text, Icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    textAlign={"center"}
    color={"white"}
    spacing={"0.5rem"}
    justifyContent={"center"}
  >
    {Icon && Icon}

    <Stack direction={"column"}>
      <Typography variant="caption" color={"gray"}>
        {heading}
      </Typography>
      <Typography variant="body1">{text}</Typography>
    </Stack>
  </Stack>
);

const Profile = ({ user }) => {
  return (
    <Stack spacing={"1rem"} alignItems={"center"} padding={"1rem"}>
      <Avatar
        src={transformImage(user?.avatar?.url)}
        sx={{
          width: "100px",
          height: "100px",
          objectFit: "contain",
          marginBottom: "1rem",
          border: "4px solid white",
        }}
      />
      <ProfileCard heading={"Bio"} text={user?.bio} />
      <Divider
        orientation="horizontal"
        variant="middle"
        sx={{ width: "250px", backgroundColor: "white" }}
      />
      <ProfileCard
        heading={"Username"}
        text={user?.username}
        Icon={<UserNameIcon />}
      />
      <ProfileCard heading={"Name"} text={user?.name} Icon={<FaceIcon />} />
      <ProfileCard
        heading={"Joined"}
        text={moment(user?.createdAt).fromNow()}
        Icon={<CalendarIcon />}
      />
    </Stack>
  );
};

export default Profile;
