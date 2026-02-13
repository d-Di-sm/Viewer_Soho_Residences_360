import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { createTheme, MantineProvider } from "@mantine/core";
import { TourCustomizationProvider } from "./contexts/CustomizationContextTour.jsx";

const theme = createTheme({
  /**
   * Put your mantine
   */
  components: {
    Button: {
      styles: {
        root: {
          backgroundColor: "rgba(255, 254, 247, 0.4",
          color: "black",
          "&:hover": {
            backgroundColor: "rgba(255, 254, 247, 0.6)",
          },
        },
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MantineProvider theme={theme}>
      <TourCustomizationProvider>
        <App />
      </TourCustomizationProvider>
    </MantineProvider>
  </React.StrictMode>,
);
