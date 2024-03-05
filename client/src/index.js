import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { CssBaseline } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <CssBaseline />
      <div onContextMenu={(e) => e.preventDefault()}>
        <App />
      </div>
    </HelmetProvider>
  </React.StrictMode>
);
