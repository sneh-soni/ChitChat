import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import UserItem from "../shared/UserItem";
import React, { useState } from "react";
import { sampleUsers } from "../../constants/SampleData";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAddGroupMembersMutation,
  useAvailableFriendsQuery,
} from "../../redux/api/api";
import { useDispatch, useSelector } from "react-redux";
import { setIsAddMember } from "../../redux/reducers/misc";

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
      <Stack
        width={{ xs: "18rem", sm: "20rem" }}
        paddingX={"1rem"}
        paddingY={"0.5rem"}
      >
        <DialogTitle textAlign={"center"}>Add Members</DialogTitle>
        <Stack spacing={"1rem"}>
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
        paddingX={"1rem"}
        alignItems={"center"}
        paddingY={"0.5rem"}
        justifyContent={"space-between"}
      >
        <Button variant="outlined" color="error" onClick={closeHandler}>
          Cancel
        </Button>
        <Button
          color="warning"
          variant="contained"
          disabled={isLoadingAddMembers}
          onClick={addMemberSubmitHandler}
        >
          Submit
        </Button>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
