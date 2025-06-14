import Users from "./Users.mjs";
import CustomAlert from "./customAlert.js";
import { displayHeader, displayFooter } from "./utils.js";

const users = new Users();
const customAlert = new CustomAlert();

// Initialize header and footer
document.addEventListener("DOMContentLoaded", () => {
  displayHeader();
  displayFooter();
  initializeAppointmentForm();
});

function initializeAppointmentForm() {
  const form = document.getElementById("appointment-form");
  if (!form) {
    console.error("Appointment form not found");
    return;
  }

  // Initialize date picker if needed
  initializeDatePicker();
  
  // Handle form submission
  form.addEventListener("submit", handleAppointmentSubmit);
}

function initializeDatePicker() {
  // Get date input element
  const dateInput = document.getElementById("appointment-date");
  if (!dateInput) return;

  // Set minimum date to today
  const today = new Date();
  const minDate = today.toISOString().split("T")[0];
  dateInput.min = minDate;
}

async function handleAppointmentSubmit(e) {
  e.preventDefault();

  // Get form data
  const formData = new FormData(e.target);
  const appointment = {
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    date: formData.get("date"),
    time: formData.get("time"),
    symptoms: formData.get("symptoms"),
    duration: formData.get("duration"),
    medicalHistory: formData.get("medicalHistory"),
    medications: formData.get("medications"),
    preferredDoctor: formData.get("preferredDoctor"),
    emergencyContact: formData.get("emergencyContact"),
    emergencyPhone: formData.get("emergencyPhone"),
    insurance: formData.get("insurance")
  };

  // Validate form data
  if (!validateAppointmentData(appointment)) {
    return;
  }

  try {
    // Show loading state
    const loadingAlert = customAlert.showAlert("Creating appointment...", "info");

    // Try to save appointment
    const success = users.userAppointment(appointment);

    // If user is not logged in, they will be redirected to login page
    if (success === undefined) {
      return; // Don't proceed with confirmation if user was redirected to login
    }

    // Handle success
    if (success) {
      customAlert.closeAlert(loadingAlert);
      customAlert.showSuccess("Appointment created successfully!");
      
      // Store appointment data for confirmation page
      localStorage.setItem("appointmentData", JSON.stringify(appointment));
      
      // Clear form
      e.target.reset();
      
      // Redirect to confirmation page
      setTimeout(() => {
        window.location.href = "../appointment/confirmation.html";
      }, 2000);
    }
  } catch (error) {
    // Handle error
    customAlert.closeAlert(loadingAlert);
    customAlert.showError("Failed to create appointment. Please try again.");
    console.error("Appointment error:", error);
  }
}

function validateAppointmentData(appointment) {
  // Required fields validation
  const requiredFields = [
    'fullName',
    'email',
    'phone',
    'date',
    'time',
    'symptoms',
    'medicalHistory',
    'preferredDoctor',
    'emergencyContact',
    'emergencyPhone'
  ];

  // Check if all required fields are filled
  const missingFields = requiredFields.filter(field => !appointment[field]);
  
  if (missingFields.length > 0) {
    customAlert.showError(`Please fill in the following fields: ${missingFields.join(', ')}`);
    return false;
  }

  // Date validation
  const appointmentDate = new Date(appointment.date);
  if (isNaN(appointmentDate)) {
    customAlert.showError("Please enter a valid date");
    return false;
  }
  
  const today = new Date();
  if (appointmentDate < today) {
    customAlert.showError("Please select a future date");
    return false;
  }

  // Time validation
  const timeRegex = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(appointment.time)) {
    customAlert.showError("Please enter a valid time format (HH:MM)");
    return false;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(appointment.email)) {
    customAlert.showError("Please enter a valid email address");
    return false;
  }

  // Phone number validation
  const phoneRegex = /^\d{10,15}$/;
  if (!phoneRegex.test(appointment.phone)) {
    customAlert.showError("Please enter a valid phone number");
    return false;
  }

  // Emergency contact validation
  if (!appointment.emergencyPhone.match(phoneRegex)) {
    customAlert.showError("Please enter a valid emergency contact phone number");
    return false;
  }

  return true;
}

// Handle pending appointments from login
window.addEventListener("load", () => {
  const pendingAppointment = localStorage.getItem("pendingAppointment");
  if (pendingAppointment) {
    const appointmentData = JSON.parse(pendingAppointment);
    
    // Fill form with pending data
    const form = document.getElementById("appointment-form");
    if (form) {
      Object.entries(appointmentData).forEach(([field, value]) => {
        const input = form.querySelector(`[name="${field}"]`);
        if (input) {
          input.value = value;
        }
      });
    }
  }
});
