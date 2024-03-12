import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import Table from "../../components/shared/Table";
import { Avatar, Box, Stack } from "@mui/material";
import { dashboardData } from "../../constants/SampleData";
import { fileFormat, transformImage } from "../../utils/features";
import moment from "moment";
import RenderAttachment from "../../components/shared/RenderAttachment";

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
  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(
      dashboardData.messages.map((i) => ({
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
  }, []);
  return (
    <AdminLayout>
      <Table
        heading={"All Messages"}
        rows={rows}
        columns={columns}
        rowHeight={200}
      />
    </AdminLayout>
  );
};

export default MessageMangement;
