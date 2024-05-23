import { Container, Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React from "react";

const Table = ({ rows, columns, heading, rowHeight = 52 }) => {
  return (
    <Container sx={{ height: "100vh" }}>
      <Paper
        elevation={3}
        sx={{
          padding: "0.5rem 2rem",
          borderRadius: "0.5rem",
          margin: "auto",
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Typography
          textAlign={"center"}
          variant="h5"
          fontWeight={"bold"}
          sx={{ margin: "1rem", textTransform: "uppercase" }}
        >
          {heading}
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={rowHeight}
          style={{ height: "85%" }}
          sx={{
            border: "none",
            ".table-header": {
              bgcolor: "#0288d1",
              color: "white",
              fontWeight: "bold",
            },
          }}
        />
      </Paper>
    </Container>
  );
};

export default Table;
