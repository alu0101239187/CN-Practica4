import React from "react";
import { Container } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import Header from "./components/Header";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import "./App.css";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Container disableGutters style={{ width: "100%" }}>
          <Header />
          <AppRoutes />
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
