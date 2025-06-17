import { displayHeader, displayFooter } from "./utils.js";
import CustomAlert from "./customAlert.js";

document.addEventListener("DOMContentLoaded", () => {
  displayHeader();
  displayFooter();
  initializeConfirmationPage();
});

function initializeConfirmationPage() {
  // Get appointment data from localStorage
  const appointmentData = JSON.parse(localStorage.getItem("appointmentData"));

  if (!appointmentData) {
    showError("Appointment data not found. Please try booking again.");
    return;
  }

  // Format and display appointment details
  displayAppointmentDetails(appointmentData);

  // Initialize buttons
  initializeButtons();
}

function displayAppointmentDetails(data) {
  // Format date and time
  const appointmentDate = new Date(data.date);
  const formattedDate = appointmentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = appointmentDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Display doctor name based on specialty
  const doctorName = getDoctorName(data.preferredDoctor);

  // Update DOM elements
  document.getElementById("confirmation-date").textContent = formattedDate;
  document.getElementById("confirmation-time").textContent = formattedTime;
  document.getElementById("confirmation-doctor").textContent = doctorName;
  document.getElementById("confirmation-name").textContent = data.fullName;
  document.getElementById("confirmation-phone").textContent = data.phone;
}

function getDoctorName(specialty) {
  const doctorNames = {
    general: "Dr. Nana-Akyaa Yao (General Practitioner)",
    cardiologist: "Dr. Osei Owusu (Cardiologist)",
    pediatrician: "Dr. Nana-Akyaa Yao (Pediatrician)",
    dermatologist: "Dr. Efua Owusu-Ansah (Dermatologist)",
    emergency: "Dr. Linda Okra-Boateng (Emergency Medicine)",
    orthopedic: "Dr. Kofi Takyi Asante (Orthopedic Surgeon)",
    gynecologist: "Dr. Efua Owusu-Ansah (Gynecologist)",
    other: "Dr. Kweku Oteng (Specialist)",
  };
  return doctorNames[specialty] || "Dr. Kweku Oteng (Specialist)";
}

function initializeButtons() {
  const printButton = document.getElementById("print-button");
  const backButton = document.getElementById("back-button");
  const sendNotificationButton = document.getElementById("send-notification-button");

  printButton.addEventListener("click", () => {
    window.print();
  });

  backButton.addEventListener("click", () => {
    window.location.href = "../index.html";
  });


  const customAlert = new CustomAlert();
  sendNotificationButton.addEventListener("click", () => {
   customAlert.showSuccess("Notification sent successfully! <br> Check your email for confirmation.");
  });
}

function showError(message) {
  const content = document.querySelector(".confirmation-content");
  content.innerHTML = `
    <div class="error-message">
      <i class="fas fa-exclamation-circle"></i>
      <p>${message}</p>
    </div>
  `;
}
