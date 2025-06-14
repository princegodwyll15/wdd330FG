import "../css/style.css";
import "../css/large.css";
import "../css/all.min.css";

import { displayHeader, displayFooter } from "./utils";
import { healthTalkTemplate } from "./healthEvent.mjs";
import Services from "./Services.mjs";
import Doctors from "./Doctors.mjs";
import CustomAlert from "./customAlert.js";

// Initialize header and footer first
displayHeader();
displayFooter();

// Check if we're on the index page
const currentPath = window.location.pathname;
const isIndexPage = currentPath === "/" || currentPath === "/index.html";

if (isIndexPage) {
  // Initialize custom alert
  const customAlert = new CustomAlert();

  // Check for login success message
  const loginSuccessMessage = localStorage.getItem("loginSuccessMessage");
  if (loginSuccessMessage) {
    // Show success message and clear it from localStorage
    customAlert.showSuccess(loginSuccessMessage);
    localStorage.removeItem("loginSuccessMessage");
  }

  // Load all content for index page
  // Health talks
  healthTalkTemplate();

  // Initialize services
  const service = new Services();

  // Services templates in order
  service
    .aboutTemplate()
    .then(() => service.callToAction())
    .then(() => service.ServicesTemplate())
    .then(() => service.createContactSection())
    .catch((error) => console.error("Error loading services:", error));

  // Doctors
  const doctors = new Doctors();
  service
    .getData(doctors.getDoctorDataPath())
    .then((data) => doctors.displayDoctorsOnHomePage(data))
    .catch((error) => console.error("Error loading doctors:", error));
}
