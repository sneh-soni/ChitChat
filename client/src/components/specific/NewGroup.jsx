import {
  Button,
  Dialog,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { sampleUsers } from "../../constants/SampleData";
import UserItem from "../shared/UserItem";
import { useInputValidation } from "6pp";

const NewGroup = () => {
  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id) ? prev.filter((curr) => curr !== id) : [...prev, id]
    );
  };
  const submitHandler = () => {};
  const closeHandler = () => {};
  const groupName = useInputValidation("");

  const [members, setMembers] = useState(sampleUsers);
  const [selectedMembers, setSelectedMembers] = useState([]);
  return (
    <Dialog open onClose={closeHandler}>
      <Stack
        width={{ xs: "18rem", sm: "25rem" }}
        padding={{ xs: "0.5rem", sm: "1rem" }}
        spacing={"0.5rem"}
      >
        <DialogTitle textAlign={"center"}>New Group</DialogTitle>
        <TextField
          color="warning"
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
        />
        <Typography paddingLeft={"1rem"}>Add Members</Typography>
        <Stack>
          {members.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              handler={selectMemberHandler}
              isAdded={selectedMembers.includes(user._id)}
            />
          ))}
        </Stack>
        <Stack direction="row" justifyContent={"space-between"}>
          <Button variant="outlined" color="error">
            Cancel
          </Button>
          <Button variant="contained" color="success" onClick={submitHandler}>
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
