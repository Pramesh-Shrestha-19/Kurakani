import React from "react";
import ReactDOM from "react-dom/client";
import './index.css'
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import { CallProvider } from "./context/CallContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(

<BrowserRouter>

    <AuthProvider>

        <CallProvider>

            <App />

        </CallProvider>

    </AuthProvider>

</BrowserRouter>

);

