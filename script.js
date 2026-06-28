import { auth, db } from "./firebase.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
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

// =======================================
// Firebase Authentication
// =======================================

const ADMIN_EMAIL = "ababdussalam1206@gmail.com";

const googleSignInBtn = document.getElementById("googleSignInBtn");
const signOutBtn = document.getElementById("signOutBtn");
const agreeTerms = document.getElementById("agreeTerms");
const userGreeting = document.getElementById("userGreeting");
const adminNav = document.getElementById("adminNav");
const userSection = document.getElementById("userSection");
const displayName = document.getElementById("displayName");
const saveNameBtn = document.getElementById("saveNameBtn");
const saveStatus = document.getElementById("saveStatus");

const provider = new GoogleAuthProvider();

googleSignInBtn.addEventListener("click", async () => {

    if (!agreeTerms.checked) {
        alert("Please accept the Terms & Conditions first.");
        return;
    }

    try {

        await signInWithPopup(auth, provider);

    } catch (error) {

        alert(error.message);

    }

});

signOutBtn.addEventListener("click", async () => {

    await signOut(auth);

});

onAuthStateChanged(auth, (user) => {

    if (user) {

        googleSignInBtn.classList.add("hidden");
        signOutBtn.classList.remove("hidden");

        userGreeting.classList.remove("hidden");
        userGreeting.textContent =
            "Welcome, " + user.displayName;

        userSection.classList.remove("hidden");

      const userDoc = doc(db, "participants", user.uid);

const userSnap = await getDoc(userDoc);

if (userSnap.exists()) {

    displayName.value = userSnap.data().beneficiaryName;

    displayName.disabled = true;

    saveNameBtn.disabled = true;

    saveStatus.textContent =
        "Beneficiary name already saved.";

}
        if (
            user.email &&
            user.email.toLowerCase() ===
            ADMIN_EMAIL.toLowerCase()
        ) {

            adminNav.classList.remove("hidden");

        }

    } else {

        googleSignInBtn.classList.remove("hidden");
        signOutBtn.classList.add("hidden");

        userGreeting.classList.add("hidden");

        userSection.classList.add("hidden");

        adminNav.classList.add("hidden");

    }

});
