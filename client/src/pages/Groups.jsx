import React, { Suspense, lazy, memo, useEffect, useState } from "react";
import {
  Backdrop,
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  ListItem,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { HEADER_COLOR } from "../constants/ColorConstants";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Link } from "../components/styles/styledComponents";
import { useNavigate, useSearchParams } from "react-router-dom";
import AvatarCard from "../components/shared/AvatarCard";
import { sampleChat, sampleUsers } from "../constants/SampleData";
import UserItem from "../components/shared/UserItem";
const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialog/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialog/AddMemberDialog")
);

const isAddMember = false;

const Groups = () => {
  const navigate = useNavigate();

  const chatId = useSearchParams()[0].get("group");

  const [isMobileMenu, setIsMobileMenu] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupNameUpdated, setGroupNameUpdated] = useState("");
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

  const handleMobile = () => {};

  const navigateBack = () => {
    navigate("/");
  };

  const updateGroupName = () => {
    setIsEdit(false);
    if (groupNameUpdated !== "") setGroupName(groupNameUpdated);
  };

  const openConfirmDelete = () => {
    setConfirmDeleteDialog(true);
  };

  const openAddMember = () => {};

  const closeConfirmDelete = () => {
    setConfirmDeleteDialog(false);
  };

  const deleteHandler = () => {
    closeConfirmDelete();
  };

  const removeMemberHandler = (id) => {};

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
        <IconButton onClick={() => setIsMobileMenu((prev) => !prev)}>
          <MenuIcon />
        </IconButton>
      </Box>
      <Tooltip title="Back">
        <IconButton
          sx={{
            position: "absolute",
            top: "1rem",
            left: "1rem",
            backgroundColor: "rgba(0,0,0,0.8)",
            ":hover": {
              backgroundColor: "rgba(0,0,0,0.85)",
            },
            color: "white",
          }}
          onClick={navigateBack}
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
          <IconButton onClick={updateGroupName}>
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography fontWeight={"600"}>{groupName}</Typography>
          <IconButton onClick={() => setIsEdit(true)}>
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );

  const ButtonGroup = (
    <>
      <Stack
        direction={{
          xs: "column-reverse",
          sm: "row",
        }}
        spacing={{ xs: "1rem", sm: "2rem" }}
        padding={{
          xs: "0.5rem",
          sm: "1rem",
          md: "1rem 4rem",
        }}
      >
        <Button
          onClick={openConfirmDelete}
          color="error"
          variant="outlined"
          startIcon={<DeleteIcon />}
        >
          Delete Group
        </Button>
        <Button
          onClick={openAddMember}
          color="warning"
          variant="contained"
          startIcon={<AddIcon />}
        >
          Add Members
        </Button>
      </Stack>
    </>
  );

  return (
    <Grid container height={"100vh"}>
      <Grid item sm={4} sx={{ display: { xs: "none", sm: "block" } }}>
        <GroupsList
          myGroups={sampleChat}
          chatId={""}
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
        }}
      >
        {IconBtns}
        {groupName ? (
          <>
            {GroupName}

            <Typography alignSelf={"flex-start"} margin={"1rem"}>
              Members
            </Typography>

            <Stack
              width={"100%"}
              maxWidth={"45rem"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem",
              }}
              spacing={"2rem"}
              height={"60vh"}
              overflow={"auto"}
            >
              {sampleUsers.map((user) => (
                <UserItem
                  user={user}
                  isAdded
                  key={user._id}
                  handler={removeMemberHandler}
                />
              ))}
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
        <Suspense fallback={<Backdrop open />}>{<AddMemberDialog />}</Suspense>
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
          w={"70vw"}
          myGroups={sampleChat}
          chatId={""}
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
      sx={{
        bgcolor: HEADER_COLOR,
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
          No Groups
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
      <ListItem
        divider
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",
          borderRadius: "0.2rem",
          padding: "0.5rem",
          color: "black",
        }}
      >
        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
          <AvatarCard avatar={avatar} />
          <Typography fontSize={"1.2rem"}>{name}</Typography>
        </Stack>
      </ListItem>
    </Link>
  );
});

export default Groups;
