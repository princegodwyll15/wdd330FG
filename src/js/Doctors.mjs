export default class Doctors {
    constructor() {
        this.doctorDataPath = "/json/doctors.json";
    }

    getDoctorDataPath() {
        return this.doctorDataPath;
    }

    displayDoctorsOnHomePage(doctorsData) {
        // Create section
        const doctorsSection = document.querySelector('.doctors');

        const heading = document.createElement('h2');
        heading.classList.add('doctors-heading');
        heading.textContent = "Our Doctors";
        doctorsSection.appendChild(heading);

        const container = document.createElement('div');
        container.classList.add('doctors-container');

        doctorsData.forEach(doctor => {
            const card = document.createElement('div');
            card.classList.add('doctor-card');

            card.innerHTML = `
            <img src="${doctor.image}" alt="${doctor.name}" class="doctor-image" />
            <div class="doctor-info">
                <h3 class="doctor-name">${doctor.name}</h3>
                <p class="doctor-specialty">${doctor.specialty}</p>
            </div>
            <a href="../appointment/appoint.html" target="_blank" class="book-link">Book Now</a>
        `;

            container.appendChild(card);
        });

        doctorsSection.appendChild(container);
    }

    getDoctorById(id, data) {
        return data.find(doctor => doctor.id === id);
    }
}
