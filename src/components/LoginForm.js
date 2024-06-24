// src/LoginForm.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting the login form request");

    const credentials = { emailAddress: email, password: password };

    try {
      console.log("Sending API request...");
      const response = await fetch(
        "https://dev-api.livehonorr.com/coach/account/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        }
      );

      if (!response.ok) {
        throw new Error(`Error here - status: ${response.status}`);
      }

      const data = await response.json();

      if (data.data && data.data.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
        console.log("Token stored:", data.data.accessToken);
        // alert("Login successful!");
        navigate("/sessions"); // Redirect to the sessions page
      } else {
        console.log("No token found in response:", data);
        alert("Login failed: No token found.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("Error during login. Check the console for details.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="email" className="form-label">
          Email address
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Password
        </label>
        <input
          type="password"
          className="form-control"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Login
      </button>
    </form>
  );
};

export default LoginForm;
