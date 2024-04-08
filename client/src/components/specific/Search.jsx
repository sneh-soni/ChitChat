import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from "../shared/UserItem";
import { sampleUsers } from "../../constants/SampleData";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../redux/reducers/misc";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import toast from "react-hot-toast";

const Search = () => {
  const search = useInputValidation("");
  const dispatch = useDispatch();
  const [searchUser] = useLazySearchUserQuery("");
  const [sendFriendRequest] = useSendFriendRequestMutation("");

  const { isSearch } = useSelector((store) => store.misc);

  const addFriendHandler = async (id) => {
    try {
      const res = await sendFriendRequest({ userId: id });
      if (res.data) {
        toast.success(res.data);
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  let isLoadingSendFriendRequest = false;

  const [users, setUsers] = useState([]);

  const seachCloseHandler = () => dispatch(setIsSearch(false));

  useEffect(() => {
    if (search.value.length < 1) return;
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => {
          setUsers(data.users);
        })
        .catch((err) => console.log("err: ", err));
    }, 1000);

    return () => clearTimeout(timeOutId);
  }, [search.value]);

  return (
    <Dialog open={isSearch} onClose={seachCloseHandler}>
      <Stack
        padding={{ xs: "0.5rem", sm: "1rem" }}
        width={{ xs: "18rem", sm: "25rem" }}
      >
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <List>
          {users.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
