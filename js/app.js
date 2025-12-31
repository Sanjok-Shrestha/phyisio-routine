// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {

    // Toggle mobile menu
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    menuToggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        menuToggle.classList.toggle('open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Language selector
    const languageSelector = document.getElementById('language-selector');
    languageSelector.addEventListener('change', (e) => {
        const selectedLang = e.target.value;


        localStorage.setItem('preferredLanguage', selectedLang);

        
        if (selectedLang === 'np') {
            alert("नेपाली संस्करण चाँडै आउँदैछ।");
        } else {
            // English selected - default
        }
    });

    // Highlight active nav link (if JS is preferred over server-side)
    const currentPath = window.location.pathname.split("/").pop();
    document.querySelectorAll(".nav-links a").forEach(link => {
        const href = link.getAttribute("href");
        if (href === currentPath) {
            link.classList.add("active");
        } else {
            link.classList.remove("active");
        }
    });

});
