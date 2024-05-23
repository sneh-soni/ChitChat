import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React from "react";

const ConfirmDeleteDialog = ({ open, handleClose, deleteHandler }) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Delete Group</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this group?
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ gap: "1rem" }}>
        <Button onClick={handleClose} variant="text" color="error" size="small">
          Cancel
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={deleteHandler}
          size="small"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
