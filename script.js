// =======================================
// Contribution Draw v1.0
// Phase 1A
// Splash Screen + Navigation
// =======================================

// Pages
const pages = {
    home: document.getElementById("homePage"),
    draw: document.getElementById("drawPage"),
    transparency: document.getElementById("transparencyPage"),
    statistics: document.getElementById("statisticsPage"),
    admin: document.getElementById("adminPage"),
    about: document.getElementById("aboutPage")
};

// Main Containers
const splashScreen = document.getElementById("splashScreen");
const app = document.getElementById("app");

// Navigation Buttons
const navButtons =
document.querySelectorAll(".nav-btn");

// =======================================
// Splash Screen
// =======================================

window.addEventListener("load", () => {

    setTimeout(() => {

        splashScreen.style.display = "none";

        app.classList.remove("hidden");

    }, 2000);

});

// =======================================
// Navigation
// =======================================

function showPage(pageName) {

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
        page.classList.add("hidden");
    });

    const selectedPage = document.getElementById(pageName + "Page");

    if (selectedPage) {
        selectedPage.classList.remove("hidden");
        selectedPage.classList.add("active");
    }

    navButtons.forEach(button => {
        button.classList.remove("active");

        if (button.dataset.page === pageName) {
            button.classList.add("active");
        }
    });

}

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        showPage(button.dataset.page);

    });

});
