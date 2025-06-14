import healthEventDataURL from "/json/healthTalks.json?url";
import Services from "./Services.mjs";

const service = new Services();

export async function healthTalkTemplate() {
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
                <button class="health-event-button">Register</button>
            </div>
        `;

        container.appendChild(card);
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
