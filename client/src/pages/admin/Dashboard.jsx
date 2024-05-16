import { useFetchData } from "6pp";
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Group as GroupIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  Box,
  Container,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import React from "react";
import AdminLayout from "../../components/Layout/AdminLayout";
import { DoughnutChart, LineChart } from "../../components/specific/Charts";
import {
  CurvedButton,
  SearchField,
} from "../../components/styles/styledComponents";
import { useErrors } from "../../hooks/hook";

const Dashboard = () => {
  const { data, loading, error } = useFetchData(
    process.env.REACT_APP_SERVER + "/api/v1/admin/stats",
    "dashboard-stats"
  );

  const { stats } = data || {};

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const Appbar = (
    <Paper
      elevation={3}
      sx={{
        padding: { xs: "1rem", md: "1.5rem", lg: "2rem" },
        margin: "1rem 0",
        borderRadius: "0.5rem",
      }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AdminPanelSettingsIcon sx={{ fontSize: "1.5rem" }} />
        <SearchField placeholder="search.." />
        <CurvedButton>search</CurvedButton>
        <Box flexGrow={1} />
        <Typography
          sx={{
            display: {
              xs: "none",
              lg: "block",
            },
          }}
          textAlign={"center"}
        >
          {moment().format("dddd, D MMMM YYYY")}
        </Typography>
        <NotificationsIcon sx={{ display: { xs: "none", sm: "block" } }} />
      </Stack>
    </Paper>
  );

  const Widgets = (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={"2rem"}
      justifyContent={"space-between"}
      alignItems={"center"}
      margin={"1rem 0"}
      width={"100%"}
    >
      <Widget
        title={"Users"}
        value={stats?.usersCount || 0}
        icon={<PersonIcon />}
      />
      <Widget
        title={"Chats"}
        value={stats?.groupsCount || 0}
        icon={<GroupIcon />}
      />
      <Widget
        title={"Messages"}
        value={stats?.totalchatsCount || 0}
        icon={<MessageIcon />}
      />
    </Stack>
  );

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Container component={"main"}>
          {Appbar}
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            width={"100%"}
            spacing={"1rem"}
            justifyContent={"center"}
            alignItems={{
              xs: "center",
              sm: "stretch",
            }}
            flexWrap={"wrap"}
          >
            <Paper
              elevation={3}
              sx={{
                padding: "1rem 1.5rem",
                borderRadius: "1rem",
                margin: "1rem 0",
                width: { xs: "100%", sm: "57%" },
              }}
            >
              <Typography margin={"1rem 0"} variant="h5">
                Last Messages
              </Typography>
              <LineChart value={stats?.messagesChart || []} />
            </Paper>
            <Paper
              elevation={3}
              sx={{
                padding: "1rem 1.5rem",
                margin: "1rem 0",
                borderRadius: "1rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: { xs: "75%", sm: "38%" },
                position: "relative",
              }}
            >
              <DoughnutChart
                labels={["Single Chats", "Group Chats"]}
                value={[
                  stats?.totalchatsCount - stats?.groupsCount || 0,
                  stats?.groupsCount || 0,
                ]}
              />
              <Stack
                position={"absolute"}
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={"0.5rem"}
                width={"100%"}
                height={"100%"}
              >
                <GroupIcon /> <Typography>Vs</Typography> <PersonIcon />
              </Stack>
            </Paper>
          </Stack>
          {Widgets}
        </Container>
      )}
    </AdminLayout>
  );
};

const Widget = ({ title, value, icon }) => (
  <Paper
    elevation={3}
    sx={{
      padding: "2rem",
      margin: "1rem 0",
      borderRadius: "1rem",
      width: { xs: "70%", sm: "30%" },
      maxWidth: "100%",
    }}
  >
    <Stack alignItems={"center"} spacing={"1rem"}>
      <Typography
        sx={{
          color: "black",
          borderRadius: "50%",
          border: "5px solid rgba(0,0,0,0.85)",
          height: "5rem",
          width: "5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {value}
      </Typography>
      <Stack direction={"row"} spacing={"0.5rem"} alignItems={"center"}>
        {icon}
        <Typography>{title}</Typography>
      </Stack>
    </Stack>
  </Paper>
);

export default Dashboard;
