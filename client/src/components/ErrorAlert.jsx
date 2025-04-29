import React from "react";
import { Typography, Alert, IconButton, Snackbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ErrorAlert = ({ open, error, onClose }) => {
  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      onClose={onClose}
    >
      <Alert
        variant="filled"
        severity="error"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={onClose}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        <Typography>{error}</Typography>
      </Alert>
    </Snackbar>
  );
};

export default ErrorAlert;
