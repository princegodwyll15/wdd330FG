async function convertToJson(data) {
    if (!data.ok) {
        const jsonResponse = await data.json();
        throw {
            name: "servicesError",
            message: jsonResponse.message || `HTTP error! status: ${data.status}`,
            status: data.status
        };
    }
    return data.json();

}

export default class Services {
    constructor() {
        // Initialize without page path checks
    }

    async getData(data) {
        let response = await fetch(data);
        response = await convertToJson(response);
        return response;
    }

    async aboutTemplate() {
        // Only proceed if we're on the index page
        const currentPath = window.location.pathname;
        const isIndexPage = currentPath === '/' || currentPath === '/index.html';
        if (!isIndexPage) {
            return;
        }

        const aboutDataURL = "/json/about.json";
        const aboutData = await this.getData(aboutDataURL); // getData must be defined

        aboutData.forEach(data => {
            const aboutContent = document.querySelector('.about-content');

            if (!aboutContent) {
                console.error('Element with class "about-content" not found.');
                return;
            }

            // Heading
            const aboutSectionHead = document.createElement('h2');
            aboutSectionHead.classList.add('about-content-head');
            aboutSectionHead.textContent = data.aboutHeading;
            aboutContent.appendChild(aboutSectionHead);

            // Overview Container
            const overviewContainer = document.createElement('div');
            overviewContainer.classList.add('about-content-overview-container');

            const aboutSectionOverview = document.createElement('p');
            aboutSectionOverview.classList.add('about-content-overview');
            aboutSectionOverview.textContent = data.aboutOverview;
            overviewContainer.appendChild(aboutSectionOverview);
            aboutContent.appendChild(overviewContainer);

            // Stats with Icons
            const infoItems = [
                {
                    label: 'Number of Doctors',
                    value: data.doctorsAbout.numberOfDoctors,
                    iconClass: 'fas fa-user-md'
                },
                {
                    label: 'Number of Departments',
                    value: data.doctorsAbout.departmentInfo.numberOfDepartments,
                    iconClass: 'fas fa-hospital-user'
                },
                {
                    label: 'Number of Research Labs',
                    value: data.doctorsAbout.researchLabsAbout.numberOfResearchLabs,
                    iconClass: 'fas fa-flask'
                },
                {
                    label: 'Number of Awards',
                    value: data.doctorsAbout.awardsAbout.numberOfAwards,
                    iconClass: 'fas fa-award'
                }
            ];

            const statsWrapper = document.createElement('div');
            statsWrapper.classList.add('about-stats-wrapper');

            infoItems.forEach(item => {
                const statItem = document.createElement('div');
                statItem.classList.add('about-stat-item');

                const icon = document.createElement('i');
                icon.className = `${item.iconClass} about-stat-icon`;

                const statValue = document.createElement('p');
                statValue.classList.add('about-stat-value');
                statValue.textContent = item.value;

                const statLabel = document.createElement('span');
                statLabel.classList.add('about-stat-label');
                statLabel.textContent = item.label;

                statItem.appendChild(icon);
                statItem.appendChild(statValue);
                statItem.appendChild(statLabel);
                statsWrapper.appendChild(statItem);
            });

            aboutContent.appendChild(statsWrapper);
        });
    }

    callToAction() {
        const callToActionSection = document.querySelector('.callToAction');
        if (!callToActionSection) {
            console.error('".callToAction" section not found.');
            return;
        }

        const callToActionContainer = document.createElement('div');
        callToActionContainer.classList.add('callToAction-container');
        callToActionSection.appendChild(callToActionContainer);

        const callToActionHeading = document.createElement('h2');
        callToActionHeading.classList.add('callToAction-heading');
        callToActionHeading.textContent = "In an Emergency? Need Help Now?";
        callToActionContainer.appendChild(callToActionHeading);

        const callToActionText = document.createElement('p');
        callToActionText.classList.add('callToAction-text');
        callToActionText.innerHTML =
            "Don't wait — get the help you need right now. Our expert team is on standby to support you in urgent situations.<br>" +
            "Fast, reliable, and compassionate assistance is just one call away. Reach out immediately — your safety and peace of mind come first.";
        callToActionContainer.appendChild(callToActionText);

        const callToActionLink = document.createElement('a');
        callToActionLink.classList.add('callToAction-link');
        callToActionLink.href = "../appointment/appoint.html";
        callToActionLink.textContent = "Make an Appointment";
        callToActionContainer.appendChild(callToActionLink);
    }


    async ServicesTemplate() {
        const servicesDataURL = "/json/services.json";
        const servicesData = await this.getData(servicesDataURL);

        const servicesSection = document.querySelector('.services');
        if (!servicesSection) {
            console.error('".about" section not found.');
            return;
        }

        const servicesHeader = document.createElement('h2');
        servicesHeader.classList.add('services-heading');
        servicesHeader.textContent = "Our Services";
        servicesSection.appendChild(servicesHeader);

        const servicesContainer = document.createElement('div');
        servicesContainer.classList.add('services-container');

        // Loop through each service
        servicesData.forEach(service => {
            const serviceCard = document.createElement('div');
            serviceCard.classList.add('service-card');

            const icon = document.createElement('i');
            icon.className = service.icon; // e.g., "fas fa-heartbeat"
            icon.classList.add('service-icon');
            serviceCard.appendChild(icon);

            const name = document.createElement('h3');
            name.classList.add('service-name');
            name.textContent = service.serviceName;
            serviceCard.appendChild(name);

            const desc = document.createElement('p');
            desc.classList.add('service-description');
            desc.textContent = service.description;
            serviceCard.appendChild(desc);

            servicesContainer.appendChild(serviceCard);
        });

        servicesSection.appendChild(servicesContainer);
    }

    async createContactSection() {
        const contactDataURL = "/json/contact.json";
        const contactData = await this.getData(contactDataURL);
        if (!contactData) {
            console.error('Contact data not found.');
            return;
        }

        // Main Section
        const contactSection = document.querySelector('.contact');
        contactSection.classList.add('contact-section');
        contactSection.id = 'contact';

        const contactContainer = document.createElement('div');
        contactContainer.classList.add('contact-container');

        const heading = document.createElement('h2');
        heading.classList.add('contact-heading');
        heading.textContent = 'Contact Us';
        contactContainer.appendChild(heading);

        // Google Maps iframe
        const iframe = document.createElement('iframe');
        iframe.classList.add('contact-map');
        iframe.setAttribute("width", "600");
        iframe.setAttribute("height", "450");
        iframe.setAttribute("style", "border:0;");
        iframe.setAttribute("allowfullscreen", "");
        iframe.setAttribute("loading", "lazy");
        iframe.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
        iframe.setAttribute("title", "Google Maps Location of HealthConsult");
        iframe.setAttribute("src", "https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3651.9098555983956!2d-0.2182453913579349!3d5.574302769026365!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sgh!4v1749589783643!5m2!1sen!2sgh");
        contactContainer.appendChild(iframe);

        // Contact details (info + form)
        const contactDetails = document.createElement('div');
        contactDetails.classList.add('contact-details');

        // Contact Info
        const contactInfoContainer = document.createElement('div');
        contactInfoContainer.classList.add('contact-info-container');

        const fullWidthP = document.createElement('p');
        fullWidthP.classList.add('full-width');
        fullWidthP.innerHTML = `<i class="fas fa-map-marker-alt"></i> <span>Address:</span> ${contactData.address.street}, ${contactData.address.city}, ${contactData.address.state} ${contactData.address.zip}, ${contactData.address.country}`;

        const halfColumns = document.createElement('div');
        halfColumns.classList.add('half-columns');

        const phoneP = document.createElement('p');
        phoneP.innerHTML = `<i class="fas fa-phone"></i> <span>Call Us:</span> ${contactData.phone}`;

        const emailP = document.createElement('p');
        emailP.innerHTML = `<i class="fas fa-envelope"></i> <span>Email Us:</span> ${contactData.email}`;

        halfColumns.appendChild(phoneP);
        halfColumns.appendChild(emailP);

        contactInfoContainer.appendChild(fullWidthP);
        contactInfoContainer.appendChild(halfColumns);
        contactDetails.appendChild(contactInfoContainer);

        // Contact Form
        const contactForm = document.createElement('form');
        contactForm.classList.add('contact-form');
        contactForm.innerHTML = `
        <input type="text" placeholder="Your Name" class="contact-input" required />
        <input type="email" placeholder="Your Email" class="contact-input" required />
        <textarea class="contact-input" placeholder="Your Message" required></textarea>
        <button type="submit" class="contact-button">Send Message</button>
    `;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you shortly.');
            contactForm.reset();
        });

        contactDetails.appendChild(contactForm);

        // Final assembly
        contactContainer.appendChild(contactDetails);
        contactSection.appendChild(contactContainer);

    }
}

