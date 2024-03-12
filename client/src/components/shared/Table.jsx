import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Paper, Typography } from "@mui/material";
import { HEADER_COLOR } from "../../constants/ColorConstants";

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
          sx={{ margin: "2rem", textTransform: "uppercase" }}
        >
          {heading}
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={rowHeight}
          style={{ height: "80%" }}
          sx={{
            border: "none",
            ".table-header": {
              bgcolor: HEADER_COLOR,
              color: "black",
              fontWeight: "bold",
            },
          }}
        />
      </Paper>
    </Container>
  );
};

export default Table;
