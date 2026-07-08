import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import { CallProvider } from "./context/CallContext";

ReactDOM.createRoot(document.getElementById("root")).render(

  <BrowserRouter>

    <CallProvider>

      <App />

    </CallProvider>

  </BrowserRouter>

);

