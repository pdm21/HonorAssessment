import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./LoginForm.css"; // Import the custom CSS
import weightliftingImage from "../assets/weightlifting.png"; // Import the image

const LoginForm = () => {
  // Initialize state variables for email, password, and password visibility
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const navigate = useNavigate(); // Hook for navigation

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    console.log("Submitting the login form request");

    const credentials = { emailAddress: email, password: password };

    // Send a POST request to the login API endpoint with the provided credentials in JSON format
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

      // Handle non-OK responses
      if (!response.ok) {
        throw new Error(`Error here - status: ${response.status}`);
      }

      const data = await response.json();

      // Check if the response contains a token and store it in local storage
      if (data.data && data.data.accessToken) {
        localStorage.setItem("accessToken", data.data.accessToken);
        console.log("Token stored:", data.data.accessToken);
        navigate("/sessions"); // Redirect to the sessions page
      } else {
        console.log("No token found in response:", data);
        alert("Login failed: No token found.");
      }
    } catch (error) {
      // Handle errors during the login process
      console.error("Error during login:", error);
      alert("Error during login. Check the console for details.");
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page container-fluid d-flex vh-100">
      <div className="row flex-grow-1 align-items-center">
        {/* Left container with the login form */}
        <div className="col-md-6 d-flex flex-column left-container">
          <div className="d-flex justify-content-center align-items-center flex-grow-1">
            {/* Sign-up link */}
            <div className="sign-up-text">
              <span>
                Not a Member yet? <a href="#">Sign Up</a>
              </span>
            </div>

            {/* Sign-in form */}
            <div className="sign-in-container card p-4">
              <h2 className="sign-in-text mb-4">Sign In</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  {/* Input field for email */}
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
                  {/* Input field for password with toggle visibility */}
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
                  {/* Forgot password link */}
                  <a href="#" className="forgot-password text-decoration-none">
                    Forgot Password?
                  </a>
                </div>
                {/* Submit button for the form */}
                <button type="submit" className="btn btn-primary mt-3">
                  Sign In
                </button>
              </form>
            </div>
          </div>

          {/* Footer links */}
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

        {/* Right container with image */}
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
