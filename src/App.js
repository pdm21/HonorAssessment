import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm"; // Corrected path
import SessionsPage from "./components/SessionsPage"; // Corrected path

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/sessions" element={<SessionsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
