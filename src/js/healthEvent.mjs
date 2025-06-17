import healthEventDataURL from "/json/healthTalks.json?url";
import Services from "./Services.mjs";
import Users from "./Users.mjs";
import CustomAlert from "./customAlert.js";

const service = new Services();
const User = new Users();




export default class HealthEvent {
    constructor() {
        this.customAlert = new CustomAlert();
    }

    async healthTalkTemplate() {
        const healthEventData = await service.getData(healthEventDataURL);
        const container = document.getElementById('healthEventContainer');

        if (!container) {
            console.error('Element with id "healthEventContainer" not found.');
            return;
        }

        container.innerHTML = ''; // Prevent duplicates on re-invocation

        healthEventData.forEach(data => {
            const card = document.createElement('div');
            card.classList.add('health-data');

            card.innerHTML = `
                <div class="health-event">
                    <p class="health-event-title">${data.heading}</p>
                    <p class="health-event-description">${data.description}</p>
                    <p class="health-event-date">Date: ${data.date}</p>
                    <p class="health-event-time">Time: ${data.time}</p>
                    <p class="health-event-location">Location: ${data.location}</p>
                    <p class="health-event-speaker">Speaker: ${data.speaker}</p>
                    <button class="health-event-button" data-event-id="${data.id}">Register</button>
                </div>
            `;

            container.appendChild(card);
            // Check user authentication before adding event listener
            try {
                const user = User.getCurrentUser();
                if (!user) {
                    const registerButton = card.querySelector('.health-event-button');
                    if (registerButton) {
                        registerButton.addEventListener('click', () => {
                            this.customAlert.showAlert('Please login to register for an event', 'info');
                        });
                    }
                    return;
                }

                // Add click event listener for register button
                const registerButton = card.querySelector('.health-event-button');
                if (registerButton) {
                    registerButton.addEventListener('click', () => {
                        try {
                            this.handleRegistration(data);
                        } catch (error) {
                            console.error('Error handling registration:', error);
                            this.customAlert.showAlert('Error registering for event', 'error');
                        }
                    });
                }
            } catch (error) {
                console.error('Error setting up event listener:', error);
                this.customAlert.showAlert('Error setting up registration', 'error');
            }
        });

        // Wait for DOM to render cards before setting scroll behavior
        setTimeout(() => {
            const card = container.querySelector('.health-data');
            if (!card) return;

            const cardStyle = getComputedStyle(card);
            const cardWidth = card.offsetWidth + parseInt(cardStyle.marginRight || 0);

            // Scroll one full card width
            document.querySelector('.next-btn')?.addEventListener('click', () => {
                container.scrollBy({ left: cardWidth, behavior: 'smooth' });
            });

            document.querySelector('.prev-btn')?.addEventListener('click', () => {
                container.scrollBy({ left: -cardWidth, behavior: 'smooth' });
            });
        }, 100);
    }
    handleRegistration(eventData) {
        this.customAlert.showSuccess(
            `Registration Successfully. Check your email for confirmation.<br> You have successfully registered for the health talk: ${eventData.heading}`
        );
    }
}
