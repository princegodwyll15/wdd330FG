export default class CustomAlert {
  constructor() {
    // Check if container already exists
    this.alertContainer = document.querySelector(".custom-alert-container");
    if (!this.alertContainer) {
      this.alertContainer = document.createElement("div");
      this.alertContainer.className = "custom-alert-container";
      document.body.appendChild(this.alertContainer);
    }
  }

  showAlert(message, type = "error") {
    // Create alert element
    const alert = document.createElement("div");
    alert.className = `custom-alert ${type === "success" ? "success" : "error"}`;
    alert.innerHTML = `
            <div class="alert-content">
                <span>${message}</span>
                <button class="close-btn">&times;</button>
            </div>
        `;

    // Add to container
    this.alertContainer.appendChild(alert);

    // Add fade-in animation
    alert.style.opacity = "0";
    setTimeout(() => {
      alert.style.opacity = "1";
    }, 10);

    // Auto close after 3 seconds
    setTimeout(() => {
      alert.style.opacity = "0";
      setTimeout(() => {
        alert.remove();
      }, 300);
    }, 3000);

    // Close on click
    const closeButton = alert.querySelector(".close-btn");
    closeButton.addEventListener("click", () => {
      alert.style.opacity = "0";
      setTimeout(() => {
        alert.remove();
      }, 300);
    });

    return alert; // Return the alert element for reference
  }

  showSuccess(message) {
    return this.showAlert(message, "success");
  }

  showError(message) {
    return this.showAlert(message, "error");
  }

  closeAlert(alertElement) {
    if (alertElement) {
      alertElement.style.opacity = "0";
      setTimeout(() => {
        alertElement.remove();
      }, 300);
    }
  }
}
