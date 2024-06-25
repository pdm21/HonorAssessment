// src/LoginForm.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginForm.css"; // Import the custom CSS
import weightliftingImage from "../assets/weightlifting.png"; // Correct path

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
    <div className="login-page container-fluid d-flex vh-100">
      <div className="row flex-grow-1 align-items-center">
        <div className="col-md-6 d-flex justify-content-center">
          <div className="card p-4 shadow-lg">
            <h2 className="text-center mb-4">Sign In</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
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
                  placeholder="Enter your password"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Sign In
              </button>
              <div className="text-end mt-3">
                <a href="#" className="text-decoration-none">
                  Forgot Password?
                </a>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <img
            src={weightliftingImage}
            alt="Weightlifting"
            className="img-fluid"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
