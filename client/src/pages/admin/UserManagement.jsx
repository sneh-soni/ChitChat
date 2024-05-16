import { useFetchData } from "6pp";
import { Avatar, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import Table from "../../components/shared/Table";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../utils/features";

const columns = [
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 100,
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
    width: 100,
    headerClassName: "table-header",
  },
  {
    field: "groups",
    headerName: "Groups",
    width: 100,
    headerClassName: "table-header",
  },
  {
    field: "id",
    headerName: "ID",
    width: 250,
    headerClassName: "table-header",
  },
];

const UserManagement = () => {
  const { data, loading, error } = useFetchData(
    process.env.REACT_APP_SERVER + "/api/v1/admin/all-users",
    "dashboard-users"
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
        data.transformedUsers.map((user) => ({
          ...user,
          id: user._id,
          avatar: transformImage(user.avatar, 50),
        }))
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table rows={rows} columns={columns} heading={"All Users"} />
      )}
    </AdminLayout>
  );
};

export default UserManagement;
