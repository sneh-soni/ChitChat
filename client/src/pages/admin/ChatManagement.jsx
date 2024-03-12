import { Avatar, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import AvatarCard from "../../components/shared/AvatarCard";
import Table from "../../components/shared/Table";
import { dashboardData } from "../../constants/SampleData";
import { transformImage } from "../../utils/features";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 120,
    headerClassName: "table-header",
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    renderCell: (params) => <AvatarCard avatar={params.row.avatar} />,
  },
  {
    field: "name",
    headerName: "Name",
    width: 200,
    headerClassName: "table-header",
  },
  {
    field: "totalMembers",
    headerName: "Total members",
    width: 200,
    headerClassName: "table-header",
  },
  {
    field: "members",
    headerName: "Members",
    width: 350,
    headerClassName: "table-header",
    renderCell: (params) => (
      <AvatarCard max={100} avatar={params.row.members} />
    ),
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    width: 150,
    headerClassName: "table-header",
  },
  {
    field: "creator",
    headerName: "Created By",
    width: 200,
    headerClassName: "table-header",
    renderCell: (params) => (
      <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
        <Avatar alt={params.row.creator.name} src={params.row.creator.avatar} />
        <span>{params.row.creator.name}</span>
      </Stack>
    ),
  },
];

const ChatManagement = () => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(
      dashboardData.chats.map((user) => ({
        ...user,
        id: user._id,
        avatar: user.avatar.map((i) => transformImage(i, 50)),
        members: user.members.map((i) => transformImage(i.avatar, 50)),
        creator: {
          name: user.creator.name,
          avatar: transformImage(user.creator.avatar, 50),
        },
      }))
    );
  }, []);
  return (
    <AdminLayout>
      <Table rows={rows} columns={columns} heading={"All Chats"} />
    </AdminLayout>
  );
};

export default ChatManagement;
