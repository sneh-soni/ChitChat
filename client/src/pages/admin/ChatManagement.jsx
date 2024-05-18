import { useFetchData } from "6pp";
import { Avatar, Skeleton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import AvatarCard from "../../components/shared/AvatarCard";
import Table from "../../components/shared/Table";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../utils/features";

const columns = [
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 100,
    renderCell: (params) => <AvatarCard avatar={params.row.avatar} />,
  },
  {
    field: "name",
    headerName: "Name",
    width: 200,
    headerClassName: "table-header",
  },
  {
    field: "groupChat",
    headerName: "Group",
    width: 100,
    headerClassName: "table-header",
  },
  {
    field: "totalMembers",
    headerName: "Size",
    width: 100,
    headerClassName: "table-header",
  },
  {
    field: "members",
    headerName: "Members",
    width: 250,
    headerClassName: "table-header",
    renderCell: (params) => <AvatarCard max={50} avatar={params.row.members} />,
  },
  {
    field: "totalMessages",
    headerName: "Messages",
    width: 100,
    headerClassName: "table-header",
  },
  {
    field: "creator",
    headerName: "Created By",
    width: 220,
    headerClassName: "table-header",
    renderCell: (params) => (
      <Stack direction={"row"} alignItems={"center"} spacing={"0.5rem"}>
        <Avatar alt={params.row.creator.name} src={params.row.creator.avatar} />
        <span>{params.row.creator.name}</span>
      </Stack>
    ),
  },
  {
    field: "id",
    headerName: "Mongo Id",
    width: 260,
    headerClassName: "table-header",
  },
];

const ChatManagement = () => {
  const { data, loading, error } = useFetchData(
    process.env.REACT_APP_SERVER + "/api/v1/admin/all-chats",
    "dashboard-chats"
  );

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (data) {
      setRows(
        data.transformedChats.map((user) => ({
          ...user,
          id: user._id,
          avatar: user.avatar.map((i) => transformImage(i, 50)),
          members: user.members.map((i) => transformImage(i.avatar, 50)),
          creator: {
            name: user.creator.name,
            avatar: transformImage(user.creator.avatar, 50),
          },
          groupChat: user.groupChat ? "Yes" : "No",
        }))
      );
    }
  }, [data]);
  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table rows={rows} columns={columns} heading={"All Chats"} />
      )}
    </AdminLayout>
  );
};

export default ChatManagement;
