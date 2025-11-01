import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css"; // Importujeme naše styly

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {/* Obalíme aplikaci routerem */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);