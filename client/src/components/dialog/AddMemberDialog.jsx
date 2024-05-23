import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAddGroupMembersMutation,
  useAvailableFriendsQuery,
} from "../../redux/api/api";
import { setIsAddMember } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const AddMemberDialog = ({ chatId }) => {
  const dispatch = useDispatch();
  const [selectedMembers, setSelectedMembers] = useState([]);

  const { isAddMember } = useSelector((store) => store.misc);
  const [addMembers, isLoadingAddMembers] = useAsyncMutation(
    useAddGroupMembersMutation
  );
  const { isLoading, isError, error, data } = useAvailableFriendsQuery(chatId);

  const closeHandler = () => {
    dispatch(setIsAddMember(false));
  };

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((curr) => curr !== id) : [...prev, id]
    );
  };

  const addMemberSubmitHandler = () => {
    addMembers("Adding members...", { chatId, members: selectedMembers });
    closeHandler();
  };

  useErrors([{ isError, error }]);

  return (
    <Dialog open={isAddMember} onClose={closeHandler}>
      <Stack width={{ xs: "80vw", sm: "25rem" }}>
        <DialogTitle textAlign={"center"}>Add Members</DialogTitle>
        <Stack spacing={"0.5rem"}>
          {isLoading ? (
            <Skeleton />
          ) : data?.friends?.length > 0 ? (
            data?.friends?.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(user._id)}
              />
            ))
          ) : (
            <Typography textAlign={"center"}>No Friends to add!</Typography>
          )}
        </Stack>
      </Stack>
      <Stack
        direction={"row"}
        paddingY={"1rem"}
        alignItems={"center"}
        paddingX={"0.5rem"}
        justifyContent={"space-between"}
      >
        <Button
          variant="text"
          size="small"
          color="error"
          onClick={closeHandler}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          size="small"
          variant="contained"
          disabled={isLoadingAddMembers}
          onClick={addMemberSubmitHandler}
        >
          confirm
        </Button>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
