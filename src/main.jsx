import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { CssBaseline, GeistProvider } from "@geist-ui/core";

ReactDOM.createRoot(document.getElementById("root")).render(
  <NextUIProvider
    theme={{
      primaryColor: "theme('colors.primary')",
      secondaryColor: "theme('colors.primary')",
      font: "Inter, sans-serif",
    }}
  >
    <GeistProvider themeType="dark">
      <CssBaseline />
      <React.StrictMode>
        <main className="dark">
          <App />
        </main>
      </React.StrictMode>
    </GeistProvider>
  </NextUIProvider>
);

window.ipcRenderer.on("main-process-message", (_event, message) => {
  console.log(message);
});
