document.addEventListener("DOMContentLoaded", () => {
  // Select all section elements dynamically
  const allSections = document.querySelectorAll("section");

  // Add the fade-in class to each section
  allSections.forEach((section) => section.classList.add("fade-in"));

  // Set up Intersection Observer options
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  // Observer callback
  const fadeInOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("visible");
      observer.unobserve(entry.target); // Unobserve after fade-in
    });
  }, observerOptions);

  // Observe all fade-in sections
  allSections.forEach((section) => {
    fadeInOnScroll.observe(section);
  });
});
