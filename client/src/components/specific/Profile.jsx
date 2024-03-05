import { Avatar, Divider, Stack, Typography } from "@mui/material";
import React from "react";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import moment from "moment";

const ProfileCard = ({ text, Icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    textAlign={"center"}
    color={"white"}
    spacing={"1rem"}
    justifyContent={"center"}
  >
    {Icon && Icon}

    <Stack direction={"column"} spacing={0.5}>
      <Typography variant="body1">{text}</Typography>
      <Typography variant="caption" color={"gray"}>
        {heading}
      </Typography>
    </Stack>
  </Stack>
);

const Profile = () => {
  return (
    <Stack spacing={"1rem"} alignItems={"center"} padding={"1rem"}>
      <Avatar
        sx={{
          width: "100px",
          height: "100px",
          objectFit: "contain",
          marginBottom: "1rem",
          border: "4px solid white",
        }}
      />
      <ProfileCard heading={"Bio"} text={"sneh soni"} />
      <ProfileCard
        heading={"Username"}
        text={"sneh soni"}
        Icon={<UserNameIcon />}
      />
      <ProfileCard heading={"Name"} text={"sneh soni"} Icon={<FaceIcon />} />
      <ProfileCard
        heading={"Joined"}
        text={moment("2023-12-31T18:30:00.000Z").fromNow()}
        Icon={<CalendarIcon />}
      />
      <Divider
        orientation="horizontal"
        variant="middle"
        sx={{ width: "250px", backgroundColor: "white" }}
      />
    </Stack>
  );
};

export default Profile;
