import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
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
    renderCell: (params) => (
      <Avatar alt={params.row.name} src={params.row.avatar} />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    width: 200,
    headerClassName: "table-header",
  },
  {
    field: "username",
    headerName: "Username",
    width: 200,
    headerClassName: "table-header",
  },
  {
    field: "friends",
    headerName: "Friends",
    width: 150,
    headerClassName: "table-header",
  },
  {
    field: "groups",
    headerName: "Groups",
    width: 150,
    headerClassName: "table-header",
  },
];

const UserManagement = () => {
  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(
      dashboardData.users.map((user) => ({
        ...user,
        id: user._id,
        avatar: transformImage(user.avatar, 50),
      }))
    );
  }, []);
  return (
    <AdminLayout>
      <Table rows={rows} columns={columns} heading={"All Users"} />
    </AdminLayout>
  );
};

export default UserManagement;
