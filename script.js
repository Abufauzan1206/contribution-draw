// =======================================
// Contribution Draw v1.0
// Main Script
// =======================================

// Firebase
import { auth, db } from "./firebase.js";

import {
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// =======================================
// Constants
// =======================================

const ADMIN_EMAIL = "ababdussalam1206@gmail.com";

const provider = new GoogleAuthProvider();

// =======================================
// DOM Elements
// =======================================

const splashScreen = document.getElementById("splashScreen");
const app = document.getElementById("app");

const googleSignInBtn = document.getElementById("googleSignInBtn");
const signOutBtn = document.getElementById("signOutBtn");

const agreeTerms = document.getElementById("agreeTerms");

const userGreeting = document.getElementById("userGreeting");

const userSection = document.getElementById("userSection");

const adminNav = document.getElementById("adminNav");

const displayName = document.getElementById("displayName");
const saveNameBtn = document.getElementById("saveNameBtn");
const saveStatus = document.getElementById("saveStatus");

// =======================================
// Pages
// =======================================

const pages = {
    home: document.getElementById("homePage"),
    draw: document.getElementById("drawPage"),
    transparency: document.getElementById("transparencyPage"),
    statistics: document.getElementById("statisticsPage"),
    admin: document.getElementById("adminPage"),
    about: document.getElementById("aboutPage")
};

const navButtons = document.querySelectorAll(".nav-btn");

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

    const selectedPage =
        document.getElementById(pageName + "Page");

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
