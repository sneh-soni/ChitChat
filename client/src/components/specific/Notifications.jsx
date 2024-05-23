import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducers/misc";
import { transformImage } from "../../utils/features";
import { CloseRounded, CheckRounded } from "@mui/icons-material";

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"0.5rem"}
        width={"100%"}
      >
        <Avatar alt={name} src={transformImage(avatar)} />
        <Stack flexGrow={1}>
          <Typography
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontSize: { xs: "0.8rem", sm: "1rem" },
            }}
          >
            {name}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: { xs: "0.5rem", sm: "0.6rem" } }}
            color={"gray"}
          >
            sent a request
          </Typography>
        </Stack>
        <Stack direction={"row"} spacing={"0.5rem"}>
          <Button
            color="error"
            variant="outlined"
            size="small"
            onClick={() => handler({ _id, accept: false })}
          >
            <CloseRounded fontSize={"small"} />
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="small"
            onClick={() => handler({ _id, accept: true })}
          >
            <CheckRounded fontSize={"small"} />
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

const Notifications = () => {
  const dispatch = useDispatch();
  const { isLoading, data, error, isError } = useGetNotificationsQuery();
  const { isNotification } = useSelector((store) => store.misc);
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  useErrors([{ error, isError }]);

  const closeHandler = () => dispatch(setIsNotification(false));

  const friendRequestHandler = async ({ _id, accept }) => {
    await acceptRequest(`${accept ? "Accepting.." : "Rejecting.."}`, {
      requestId: _id,
      accept,
    });
    dispatch(setIsNotification(false));
  };

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack width={{ xs: "80vw", sm: "25rem" }}>
        <DialogTitle>Notifications</DialogTitle>
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {data?.allRequests.length > 0 ? (
              data?.allRequests?.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  sender={notification.sender}
                  _id={notification._id}
                  handler={friendRequestHandler}
                />
              ))
            ) : (
              <Typography textAlign={"center"} padding={"1rem"}>
                Nothing new here
              </Typography>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  );
};

export default Notifications;
