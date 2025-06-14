import Users from "./Users.mjs";
import CustomAlert from "./customAlert.js";

const users = new Users();
const customAlert = new CustomAlert();

document
  .getElementById("register-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const fname = document.getElementById("fname").value.trim();
    const lname = document.getElementById("lname").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirm-password")
      .value.trim();

    // First validate passwords match
    if (password !== confirmPassword) {
      customAlert.showError("Passwords do not match. Please try again.");
      return;
    }

    // Create user info object
    const userInfo = {
      fname: fname,
      lname: lname,
      email: email,
      phone: phone,
      password: password,
    };

    // Validate required fields
    const requiredFields = ["fname", "lname", "email", "phone", "password"];
    const missingFields = requiredFields.filter((field) => !userInfo[field]);
    if (missingFields.length > 0) {
      customAlert.showError(
        `Please fill in the following fields: ${missingFields.join(", ")}`,
      );
      return;
    }

    try {
      // Register user
      await users.registerUser(userInfo);

      // Generate token
      const token = users.generateFakeJWT({
        email: userInfo.email,
        exp: Math.floor(Date.now() / 1000) + 3600,
      });

      // Store token
      localStorage.setItem("authToken", token);

      // Store user data with token
      const usersList = users.getUsers();
      const newUserIndex = usersList.findIndex(
        (u) => u.email === userInfo.email,
      );
      if (newUserIndex !== -1) {
        usersList[newUserIndex].token = token;
        users.saveUsers(usersList);
      }

      customAlert.showSuccess(
        "Registration successful! Redirecting to home page...",
      );
      window.location.href = "../index.html";
    } catch (err) {
      customAlert.showError(err.message);
    }
  });
