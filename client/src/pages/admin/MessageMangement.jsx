import { useFetchData } from "6pp";
import { Avatar, Box, Skeleton, Stack } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import RenderAttachment from "../../components/shared/RenderAttachment";
import Table from "../../components/shared/Table";
import { useErrors } from "../../hooks/hook";
import { fileFormat, transformImage } from "../../utils/features";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 120,
    headerClassName: "table-header",
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => {
      const { attachments } = params.row;
      return attachments?.length > 0
        ? attachments.map((i) => {
            const url = i.url;
            const file = fileFormat(url);
            return (
              <Box>
                <a
                  href={url}
                  target="_blank"
                  download
                  style={{
                    color: "black",
                  }}
                >
                  {RenderAttachment(file, url)}
                </a>
              </Box>
            );
          })
        : "No attachments";
    },
  },
  {
    field: "content",
    headerName: "Message content",
    width: 400,
    headerClassName: "table-header",
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 200,
    renderCell: (params) => (
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
        <span>{params.row.sender.name}</span>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    width: 150,
    headerClassName: "table-header",
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    width: 150,
    headerClassName: "table-header",
  },
  {
    field: "createdAt",
    headerName: "Created At",
    width: 280,
    headerClassName: "table-header",
  },
];

const MessageMangement = () => {
  const { data, loading, error } = useFetchData(
    process.env.REACT_APP_SERVER + "/api/v1/admin/all-messages",
    "dashboard-messages"
  );

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  console.log(data);

  const [rows, setRows] = useState([]);
  useEffect(() => {
    if (data) {
      setRows(
        data.transformedMessages.map((i) => ({
          ...i,
          id: i._id,
          sender: {
            name: i.sender.name,
            avatar: transformImage(i.sender.avatar, 50),
          },
          groupChat: i.groupChat ? "Yes" : "No",
          createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
        }))
      );
    }
  }, [data]);
  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table
          heading={"All Messages"}
          rows={rows}
          columns={columns}
          rowHeight={200}
        />
      )}
    </AdminLayout>
  );
};

export default MessageMangement;
