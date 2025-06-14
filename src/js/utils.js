import Users from "./Users.mjs";
import CustomAlert from "./customAlert.js";

// function to display full date and time in header
export function displayFullDateTime() {
  const dateTimeElement = document.getElementById("dateTime");
  if (!dateTimeElement) {
    console.error('Element with id "dateTime" not found.');
    return;
  }
  const time = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  const formattedDateTime = time.toLocaleString("en-US", options);
  dateTimeElement.textContent = formattedDateTime;
  setTimeout(displayFullDateTime, 1000);
}

export function displayHeader() {
  const header = document.getElementById("main-header");
  if (!header) {
    console.error('Header element with id "main-header" not found.');
    return;
  }

  // Check if current page is home page
  const path = window.location.pathname.toLowerCase();
  const isHomePage = path.endsWith('index.html') || path === '/';

  // Create header structure
  header.innerHTML = `
        <div class="logo-container">
            <div class="logo">
                <a href="../index.html"><span>Health</span>Consult</a>
                <p id="dateTime"></p>
                <a href="../account/login.html" id="account-link"><span>My Account</span></a>
            </div>
        </div>
        <div class="navbar-container" style="${isHomePage ? '' : 'display: none;'}">
            <div class="navbar">
                <div class="hambuger-menu">
                    <button class="menu-button"><i class="fas fa-bars"></i></button>
                </div>
                <ul class="nav-links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#about">About</a></li>
                    <li><a href="#services">Services</a></li>
                    <li><a href="#doctors">Doctors</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
                <a href="../appointment/appoint.html" class="book-button">Make an Appointment</a>
            </div>
        </div>
    `;
  document.body.insertAdjacentElement("afterbegin", header);
  displayFullDateTime();

  // Get account link element
  const accountLink = header.querySelector("#account-link");
  if (!accountLink) {
    console.error("Account link element not found.");
    return;
  }

  // Check if user is logged in
  const users = new Users();
  const token = localStorage.getItem("authToken");

  if (token) {
    try {
      // Get all users from localStorage
      const usersList = users.getUsers();

      // Find user by email from token
      const decodedToken = users.decodeToken(token);
      const currentUser = usersList.find(
        (user) => user.email === decodedToken.email,
      );
      if (currentUser) {
        const fullName = `${currentUser.firstName} ${currentUser.lastName}`;
        accountLink.href = "#";
        accountLink.innerHTML = `<span>Logout ${fullName}</span>`;
        accountLink.onclick = async function (e) {
          e.preventDefault();

          // Show loading alert
          const customAlert = new CustomAlert();
          const loadingAlert = customAlert.showAlert("Logging out...", "info");

          try {
            // Perform logout
            await users.logout();

            // Update the link to point to the login page
            accountLink.href = "../account/login.html";
            accountLink.innerHTML = "<span>My Account</span>";

            // Show success alert
            customAlert.closeAlert(loadingAlert);
            const successAlert = customAlert.showSuccess(
              "You have been logged out",
            );

            // Redirect to the login page after a short delay
            setTimeout(() => {
              window.location.href = "../account/login.html";
            }, 2000);
          } catch (error) {
            // Handle any logout errors
            customAlert.closeAlert(loadingAlert);
            customAlert.showError("Failed to logout. Please try again.");
            console.error("Logout error:", error);
          }
        };
      } else {
        console.error("User not found in database");
        // Fallback to email if user not found
        accountLink.href = "../account/login.html";
        accountLink.innerHTML = "<span>My Account</span>";
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      // If token is invalid, remove it and show login link
      localStorage.removeItem("authToken");
      accountLink.href = "../account/login.html";
      accountLink.innerHTML = "<span>My Account</span>";
    }
  } else {
    // User is not logged in
    accountLink.href = "../account/login.html";
    accountLink.innerHTML = "<span>My Account</span>";
  }
}

export function displayFooter() {
  const footer = document.getElementById("main-footer");

  if (!footer) {
    console.error('Footer element with id "main-footer" not found.');
    return;
  }

  footer.innerHTML = `
    <div class="footer-container">
        <div class="footer-section footer-links">
            <h3>Quick Links</h3>
            <ul>
                <li><a href="/index.html#about">About Us</a></li>
                <li><a href="/index.html#services">Our Services</a></li>
                <li><a href="/index.html#contact">Contact Us</a></li>
                <li><a href="/index.html#privacy">Privacy Policy</a></li>
            </ul>
        </div>

        <div class="footer-section footer-social">
            <h3>Connect With Us</h3>
            <div class="social-icons">
                <a href="https://facebook.com/healthconsult" target="_blank" aria-label="Facebook">
                    <i class="fab fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com/healthconsult" target="_blank" aria-label="Twitter">
                    <i class="fab fa-twitter"></i>
                </a>
                <a href="https://linkedin.com/company/healthconsult" target="_blank" aria-label="LinkedIn">
                    <i class="fab fa-linkedin-in"></i>
                </a>
                <a href="https://instagram.com/healthconsult" target="_blank" aria-label="Instagram">
                    <i class="fab fa-instagram"></i>
                </a>
            </div>
        </div>

        <div class="footer-section footer-contact">
            <h3>Contact Info</h3>
            <p><i class="fas fa-map-marker-alt"></i> 123 Health Ave, Wellness City</p>
            <p><i class="fas fa-phone"></i> (123) 456-7890</p>
            <p><i class="fas fa-envelope"></i> info@healthconsult.com</p>
        </div>
    </div>
    <div class="footer-bottom">
        <p>&copy; ${new Date().getFullYear()} HealthConsult. All rights reserved.</p>
    </div>
    `;

  // It's generally better to append the footer to the body once if it's not already there.
  // If you're calling this multiple times, you might want to adjust logic.
  // However, if the element already exists, innerHTML will just update its content.
  if (!document.body.contains(footer)) {
    document.body.insertAdjacentElement("beforeend", footer);
  }
}
