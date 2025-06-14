import { displayHeader, displayFooter } from "./utils.js";

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
    general: "Dr. Smith (General Practitioner)",
    cardiologist: "Dr. Johnson (Cardiologist)",
    pediatrician: "Dr. Williams (Pediatrician)",
    dermatologist: "Dr. Brown (Dermatologist)",
    other: "Dr. Miller (Specialist)",
  };
  return doctorNames[specialty] || "Dr. Miller (Specialist)";
}

function initializeButtons() {
  const printButton = document.getElementById("print-button");
  const backButton = document.getElementById("back-button");

  printButton.addEventListener("click", () => {
    window.print();
  });

  backButton.addEventListener("click", () => {
    window.location.href = "../index.html";
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
