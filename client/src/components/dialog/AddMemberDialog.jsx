import { Button, Dialog, DialogTitle, Stack, Typography } from "@mui/material";
import UserItem from "../shared/UserItem";
import React, { useState } from "react";
import { sampleUsers } from "../../constants/SampleData";

const AddMemberDialog = ({ addMember, isLoadingAddMember, chatId }) => {
  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const closeHandler = () => {
    setMembers([]);
    setSelectedMembers([]);
  };

  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((curr) => curr !== id) : [...prev, id]
    );
  };

  const addMemberSubmitHandler = () => {
    closeHandler();
  };

  return (
    <Dialog open onClose={closeHandler}>
      <Stack
        width={{ xs: "18rem", sm: "20rem" }}
        paddingX={"1rem"}
        paddingY={"0.5rem"}
      >
        <DialogTitle textAlign={"center"}>Add Members</DialogTitle>
        <Stack spacing={"1rem"}>
          {members.length > 0 ? (
            members.map((user) => (
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
          disabled={isLoadingAddMember}
          onClick={addMemberSubmitHandler}
        >
          Create
        </Button>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
