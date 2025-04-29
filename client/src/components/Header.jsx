import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

const Header = () => {
  return (
    <AppBar
      position="sticky"
      sx={{
        width: "100%",
        marginTop: "20px",
        marginBottom: "20px",
      }}
    >
      <Toolbar>
        <a
          href="/"
          style={{
            textDecoration: "none",
            color: "inherit",
            fontSize: "1.2rem",
            marginLeft: "10px",
          }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: "bold" }}
          >
            Servicios
          </Typography>
        </a>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
