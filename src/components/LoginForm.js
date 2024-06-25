import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginForm.css"; // Import the custom CSS
import weightliftingImage from "../assets/weightlifting.png"; // Import the image

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page container-fluid d-flex vh-100">
      <div className="row flex-grow-1 align-items-center">
        <div className="col-md-6 d-flex flex-column left-container">
          <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <div className="sign-up-text">
              <span>
                Not a Member yet? <a href="#">Sign Up</a>
              </span>
            </div>
            <div className="sign-in-container card p-4">
              <h2 className="sign-in-text mb-4">Sign In</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 position-relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <span
                    className="password-toggle-icon"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <i className="fas fa-eye-slash"></i>
                    ) : (
                      <i className="fas fa-eye"></i>
                    )}
                  </span>
                </div>
                <div className="text-end mt-3">
                  <a href="#" className="text-decoration-none">
                    Forgot Password?
                  </a>
                </div>
                <button type="submit" className="btn btn-primary mt-3">
                  Sign In
                </button>
              </form>
            </div>
          </div>
          <div className="footer-links">
            <a href="#" className="text-decoration-none me-3">
              Terms
            </a>
            <a href="#" className="text-decoration-none me-3">
              Privacy Policy
            </a>
            <a href="#" className="text-decoration-none">
              Contact Us
            </a>
          </div>
        </div>
        <div className="col-md-6 d-flex align-items-center justify-content-center login-image-container">
          <img
            src={weightliftingImage}
            alt="Weightlifting"
            className="img-fluid weightlifting-image"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
