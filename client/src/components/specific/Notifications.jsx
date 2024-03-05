import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Stack,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import { sampleNotifications } from "../../constants/SampleData";

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem divider>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar />
        <Stack>
          <Typography
            variant="body1"
            sx={{
              flexGrow: 1,
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {name}
          </Typography>
          <Typography variant="caption" fontSize={"0.6rem"} color={"gray"}>
            sent you a request
          </Typography>
        </Stack>
        <Stack
          paddingX={"1rem"}
          direction={{ xs: "column", sm: "row" }}
          spacing={"0.5rem"}
        >
          <Button
            color="error"
            variant="outlined"
            size="small"
            onClick={() => handler({ _id, accept: false })}
          >
            Reject
          </Button>
          <Button
            color="success"
            variant="contained"
            size="small"
            onClick={() => handler({ _id, accept: true })}
          >
            Accept
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

const Notifications = () => {
  const friendRequestHandler = ({ _id, accept }) => {};
  return (
    <Dialog open>
      <Stack
        width={{ xs: "18rem", sm: "25rem" }}
        padding={{ xs: "0.5rem", sm: "1rem" }}
      >
        <DialogTitle>Notifications</DialogTitle>
        {sampleNotifications.length > 0 ? (
          sampleNotifications.map((notification) => (
            <NotificationItem
              key={notification._id}
              sender={notification.sender}
              _id={notification._id}
              handler={friendRequestHandler}
            />
          ))
        ) : (
          <Typography textAlign={"center"}>No Notifications</Typography>
        )}
      </Stack>
    </Dialog>
  );
};

export default Notifications;
