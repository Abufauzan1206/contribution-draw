// =======================================
// Contribution Draw v1.0
// draw.js
// Part 1 of 5
// Firebase setup, constants and initialization
// =======================================

// Import Firebase services
import { auth, db } from "./firebase.js";

import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    addDoc,
    getDocs,
    collection,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


// =======================================
// Months available in the draw
// =======================================

// June is reserved for the Admin and will never
// be assigned during the public draw.
const DRAW_MONTHS = [
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
    "January",
    "February",
    "March"
];

const ADMIN_MONTH = "June";


// =======================================
// Collection names
// =======================================

const PARTICIPANTS_COLLECTION = "participants";
const TRANSPARENCY_COLLECTION = "hallOfTransparency";
const SETTINGS_COLLECTION = "settings";


// =======================================
// Cached DOM Elements
// =======================================

// Gift boxes (all elements with class "gift-box")
const giftBoxes = document.querySelectorAll(".gift-box");

// Latest Selection display
const latestSelection =
    document.getElementById("latestSelection");

// Progress display
const progressText =
    document.getElementById("progressText");

// Optional progress bar
const progressBar =
    document.getElementById("progressBar");

// Hall of Transparency container
const hallContainer =
    document.getElementById("hallOfTransparency");


// =======================================
// Runtime Variables
// =======================================

let currentUser = null;

// Prevent multiple taps
let drawInProgress = false;

// Stores assigned months already in Firebase
let assignedMonths = [];

// Total public months available
const TOTAL_AVAILABLE_MONTHS = DRAW_MONTHS.length;


// =======================================
// Authentication Listener
// =======================================

onAuthStateChanged(auth, (user) => {

    if (!user) {
        console.log("No authenticated user.");
        return;
    }

    currentUser = user;

    console.log("Signed in as:", user.displayName);

    // Load existing assignments
    initializeDraw();

});


// =======================================
// Initialize Draw
// =======================================

async function initializeDraw() {

    try {

        await loadAssignedMonths();

        await loadHallOfTransparency();

        await updateProgress();

    } catch (error) {

        console.error(
            "Initialization failed:",
            error
        );

    }

}


// =======================================
// Load Assigned Months
// =======================================

async function loadAssignedMonths() {

    assignedMonths = [];

    const snapshot = await getDocs(
        collection(db, PARTICIPANTS_COLLECTION)
    );

    snapshot.forEach((document) => {

        const data = document.data();

        if (data.assignedMonth) {
            assignedMonths.push(data.assignedMonth);
        }

    });

}
