import { Grid, Skeleton, Stack } from "@mui/material";
import React from "react";

export const LayoutLoader = () => {
  return (
    <Grid container height={"100vh"} spacing={"0.5rem"}>
      <Grid
        item
        sm={4}
        md={3}
        sx={{
          display: { xs: "none", sm: "block" },
        }}
      >
        <Stack spacing={"0.5rem"}>
          <Skeleton variant="rectangular" height={"4rem"} />
          <Skeleton variant="rectangular" height={"calc(100vh - 4rem)"} />
        </Stack>
      </Grid>
      <Grid item xs={12} sm={8} md={5} lg={6} height={"100vh"}>
        <Stack spacing={"0.5rem"}>
          <Skeleton variant="rectangular" height={"4rem"} />
          <Skeleton variant="rectangular" height={"calc(100vh - 4rem)"} />
        </Stack>
      </Grid>
      <Grid
        item
        md={4}
        lg={3}
        sx={{
          display: { xs: "none", md: "block" },
        }}
      >
        <Stack spacing={"0.5rem"}>
          <Skeleton variant="rectangular" height={"4rem"} />
          <Skeleton variant="rectangular" height={"calc(100vh - 4rem)"} />
        </Stack>
      </Grid>
    </Grid>
  );
};
