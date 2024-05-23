import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LayoutLoader } from "../components/Layout/Loaders";
import AvatarCard from "../components/shared/AvatarCard";
import UserItem from "../components/shared/UserItem";
import { Link } from "../components/styles/styledComponents";
import { useAsyncMutation, useErrors } from "../hooks/hook";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { setIsAddMember } from "../redux/reducers/misc";

const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialog/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialog/AddMemberDialog")
);

const Groups = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const chatId = useSearchParams()[0].get("group");
  const myGroups = useMyGroupsQuery();
  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );

  const { isAddMember } = useSelector((store) => store.misc);

  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdated, setGroupNameUpdated] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);
  const [members, setMembers] = useState([]);

  const [renameGroup, isLoadingGroupName] = useAsyncMutation(
    useRenameGroupMutation
  );
  const [removeMember, isLoadingRemoveMember] = useAsyncMutation(
    useRemoveGroupMemberMutation
  );
  const [deleteGroup] = useAsyncMutation(useDeleteChatMutation);

  const errors = [
    {
      isError: myGroups.isError,
      error: myGroups.error,
    },
    {
      isError: groupDetails.isError,
      error: groupDetails.error,
    },
  ];

  useErrors(errors);

  useEffect(() => {
    if (groupDetails.data) {
      setMembers(groupDetails.data.chat.members);
      setGroupName(groupDetails.data.chat.name);
      setGroupNameUpdated(groupDetails.data.chat.name);
    }

    return () => {
      setMembers([]);
      setGroupNameUpdated("");
      setGroupName("");
      setIsEdit(false);
    };
  }, [groupDetails.data]);

  useEffect(() => {
    if (groupDetails.isError) navigate("/");
  }, [groupDetails.isError]);

  const handleMobile = () => {};

  const navigateBack = () => {
    navigate("/");
  };

  const updateGroupName = () => {
    setIsEdit(false);
    renameGroup("Updating group name...", { chatId, name: groupNameUpdated });
  };

  const openConfirmDelete = () => {
    setConfirmDeleteDialog(true);
  };

  const openAddMember = () => {
    dispatch(setIsAddMember(true));
  };

  const closeConfirmDelete = () => {
    setConfirmDeleteDialog(false);
  };

  const deleteHandler = () => {
    deleteGroup("Deleting group...", chatId);
    closeConfirmDelete();
    navigate("/groups");
  };

  const removeMemberHandler = (userId) => {
    removeMember("Removing member...", { chatId, userId });
  };

  useEffect(() => {
    if (chatId) {
      setGroupName(`Group Name ${chatId}`);
      setGroupNameUpdated(`Group Name ${chatId}`);
    }

    return () => {
      setGroupName("");
      setGroupNameUpdated("");
      setIsEdit(false);
    };
  }, [chatId]);

  const IconBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            top: "1rem",
            right: "1rem",
          },
        }}
      >
        <IconButton
          size="small"
          onClick={() => setIsMobileMenu((prev) => !prev)}
        >
          <MenuIcon />
        </IconButton>
      </Box>
      <Tooltip title="Back">
        <IconButton
          sx={{
            position: "absolute",
            top: "1rem",
            left: "0.5rem",
            backgroundColor: "rgba(0,0,0,0.7)",
            ":hover": {
              backgroundColor: "rgba(0,0,0,0.75)",
            },
            color: "white",
          }}
          onClick={navigateBack}
          size="small"
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const GroupName = (
    <Stack
      direction={"row"}
      justifyContent={"center"}
      alignItems={"center"}
      spacing={"1rem"}
    >
      {isEdit ? (
        <>
          <TextField
            value={groupNameUpdated}
            onChange={(e) => setGroupNameUpdated(e.target.value)}
          />
          <IconButton
            size="small"
            onClick={updateGroupName}
            disabled={isLoadingGroupName}
          >
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography fontWeight={"600"} wordBreak={"break-word"}>
            {groupName}
          </Typography>
          <IconButton
            onClick={() => setIsEdit(true)}
            disabled={isLoadingGroupName}
            size="small"
          >
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );

  const ButtonGroup = (
    <>
      <Stack
        direction={"row"}
        spacing={{ xs: "1rem", sm: "2rem" }}
        paddingY={{
          xs: "1rem",
          md: "1rem 4rem",
        }}
      >
        <Button
          onClick={openConfirmDelete}
          color="error"
          size="small"
          variant="outlined"
          startIcon={<DeleteIcon />}
        >
          Delete Group
        </Button>
        <Button
          onClick={openAddMember}
          color="primary"
          size="small"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add Members
        </Button>
      </Stack>
    </>
  );

  return myGroups.isLoading ? (
    <LayoutLoader />
  ) : (
    <Grid container height={"100vh"}>
      <Grid item sm={4} sx={{ display: { xs: "none", sm: "block" } }}>
        <GroupsList
          myGroups={myGroups?.data?.groups}
          chatId={chatId}
          setIsMobileMenu={setIsMobileMenu}
        />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "1rem 3rem",
          position: "relative",
          backgroundColor: "rgba(0,0,0,0.05)",
        }}
      >
        {IconBtns}
        {groupName ? (
          <>
            {GroupName}

            <Typography alignSelf={"flex-start"} margin={"1rem"}>
              Group Members
            </Typography>

            <Stack
              width={"100%"}
              maxWidth={"45rem"}
              boxSizing={"border-box"}
              spacing={"1.5rem"}
              height={"60vh"}
              overflow={"auto"}
            >
              {isLoadingRemoveMember ? (
                <Skeleton />
              ) : (
                members.map((user) => (
                  <UserItem
                    user={user}
                    isAdded
                    key={user._id}
                    handler={removeMemberHandler}
                  />
                ))
              )}
            </Stack>

            {ButtonGroup}
          </>
        ) : (
          <Stack
            justifyContent={"center"}
            paddingX={"0.5rem"}
            height={"100%"}
            width={"100%"}
          >
            <Typography textAlign={"center"}>
              Select a Group to Manage
            </Typography>
          </Stack>
        )}
      </Grid>

      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          {<AddMemberDialog chatId={chatId} />}
        </Suspense>
      )}

      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeConfirmDelete}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}

      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
        open={isMobileMenu}
        onClose={() => setIsMobileMenu(false)}
      >
        <GroupsList
          w={"60vw"}
          myGroups={myGroups?.data?.groups}
          chatId={chatId}
          setIsMobileMenu={setIsMobileMenu}
        />
      </Drawer>
    </Grid>
  );
};

const GroupsList = ({ w = "100%", myGroups = [], chatId, setIsMobileMenu }) => {
  return (
    <Stack
      width={w}
      paddingX={"0.25rem"}
      sx={{
        bgcolor: "#0288d1",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {myGroups.length > 0 ? (
        myGroups.map((group) => (
          <GroupListItem
            group={group}
            chatId={chatId}
            key={group._id}
            setIsMobileMenu={setIsMobileMenu}
          />
        ))
      ) : (
        <Typography textAlign={"center"} padding={"1rem"}>
          No Groups Yet!
        </Typography>
      )}
    </Stack>
  );
};

const GroupListItem = memo(({ group, chatId, setIsMobileMenu }) => {
  const { name, avatar, _id } = group;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
        setIsMobileMenu(false);
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: "-100%" }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          gap: "0.5rem",
          alignItems: "center",
          padding: "0.5rem",
          color: "black",
        }}
      >
        <Stack direction={"row"} spacing={"0.5rem"} alignItems={"center"}>
          <AvatarCard avatar={avatar} />
          <Typography fontSize={"1rem"}>{name}</Typography>
        </Stack>
      </motion.div>
    </Link>
  );
});

export default Groups;
