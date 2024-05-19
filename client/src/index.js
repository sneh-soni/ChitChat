import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import store from "./redux/store";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <CssBaseline />
        <GlobalStyles
          styles={{
            "*::-webkit-scrollbar": { display: "none" },
            "*": { "-ms-overflow-style": "none", "scrollbar-width": "none" },
          }}
        />
        <div onContextMenu={(e) => e.preventDefault()}>
          <App />
        </div>
      </HelmetProvider>
    </Provider>
  </React.StrictMode>
);
