import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import { Routes, Route } from "react-router-dom";

function App() {
  return (

    <Routes>

      {/* Login Page */}
      <Route path="/" element={<Login />} />

      {/* Chat Page */}
      <Route path="/chat" element={<Chat />} />

    </Routes>

  );

}

export default App;

