import { Avatar, AvatarGroup, Box, Stack } from "@mui/material";
import React from "react";

const AvatarCard = ({ avatar = [], max = 4 }) => {
  return (
    <Stack direction={"row"} spacing={0.5}>
      <AvatarGroup max={max}>
        <Box
          width={"5rem"}
          height={"2rem"}
          sx={{ position: "relative", left: "0.5rem" }}
        >
          {avatar.map((i, index) => (
            <Avatar
              key={Math.random() * 100}
              src={i}
              alt={`Avatar ${index}`}
              sx={{
                width: "2rem",
                height: "2rem",
                position: "absolute",
                left: {
                  xs: `${0.5 + index}rem`,
                  sm: `${index}rem`,
                },
              }}
            />
          ))}
        </Box>
      </AvatarGroup>
    </Stack>
  );
};

export default AvatarCard;