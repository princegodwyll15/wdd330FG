import Users from "./Users.mjs";
import CustomAlert from "./customAlert.js";

const users = new Users();
const customAlert = new CustomAlert();

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // Basic validation
  if (!email || !password) {
    customAlert.showError("Please fill in both email and password");
    return;
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    customAlert.showError("Please enter a valid email address");
    return;
  }

  try {
    // Show loading state
    const loadingAlert = customAlert.showAlert("Logging in...", "info");

    // Login user
    try {
      const token = await users.loginUser({ email, password });

      // Get user info from token
      const decodedToken = users.decodeToken(token);

      // Store token in localStorage
      localStorage.setItem("authToken", token);

      // Get user data from localStorage
      const allUsers = users.getUsers();
      const loggedInUser = allUsers.find(
        (user) => user.email === decodedToken.email,
      );
      if (loggedInUser) {
        loggedInUser.token = token;
        users.saveUsers(allUsers);
      }

      // Remove loading alert
      customAlert.closeAlert(loadingAlert);

      // Store success message in localStorage for home page
      if (loggedInUser) {
        localStorage.setItem(
          "loginSuccessMessage",
          `Welcome back, ${loggedInUser.firstName} ${loggedInUser.lastName}`,
        );
      } else {
        localStorage.setItem(
          "loginSuccessMessage",
          `Welcome back, ${decodedToken.email}`,
        );
      }

      // Get return URL from query parameters
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get("returnUrl");

      // Check for pending appointment
      const pendingAppointment = localStorage.getItem("pendingAppointment");

      if (pendingAppointment) {
        // Remove the pending appointment from storage
        localStorage.removeItem("pendingAppointment");

        // If there's a return URL, redirect to it
        if (returnUrl) {
          window.location.href = decodeURIComponent(returnUrl);
        } else {
          // Otherwise, redirect to appointments page
          window.location.href = "../appointment/appoint.html";
        }
      } else if (returnUrl) {
        // If there's a return URL but no pending appointment, redirect to it
        window.location.href = decodeURIComponent(returnUrl);
      } else {
        // Default to home page
        window.location.href = "../index.html";
      }
    } catch (err) {
      // Remove loading alert if it exists
      if (loadingAlert) {
        customAlert.closeAlert(loadingAlert);
      }
      throw err; // Let the catch block below handle the error
    }
  } catch (err) {
    // Handle different error types
    const errorMessage =
      err.message === "Invalid email or password."
        ? "Invalid email or password. Please try again."
        : err.message === "Invalid email format."
          ? "Please enter a valid email address"
          : "Login failed. Please try again.";

    customAlert.showError(errorMessage);
  }
});
