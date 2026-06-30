// =======================================================
// Contribution Draw v1.1
// draw.js
// Section 1 of 4
// Compatible with Firebase 11.9.1
// =======================================================

import { auth, db } from "./firebase.js";

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";


// =======================================================
// Configuration
// =======================================================

// June is reserved for the administrator.
const RESERVED_MONTH = "June";

// Public months available for assignment.
const MONTHS = [
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

const PARTICIPANTS = "participants";
const TRANSPARENCY = "hallOfTransparency";


// =======================================================
// HTML Elements
// =======================================================

const boxesContainer = document.getElementById("boxesContainer");
const latestSelection = document.getElementById("latestSelection");
const selectionHistory = document.getElementById("selectionHistory");

const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const totalParticipants = document.getElementById("totalParticipants");
const monthsSelected = document.getElementById("monthsSelected");
const monthsRemaining = document.getElementById("monthsRemaining");


// =======================================================
// Runtime Variables
// =======================================================

let currentUser = null;

let assignedMonths = [];

let drawBusy = false;


// =======================================================
// Authentication
// =======================================================

onAuthStateChanged(auth, async (user) => {

    currentUser = user;

    if (!user) {
        console.log("Waiting for Google Sign-In...");
        return;
    }

    console.log("Signed in:", user.displayName);

    await initializeDraw();

});


// =======================================================
// Initialize
// =======================================================

async function initializeDraw() {

    createGiftBoxes();

    await loadAssignedMonths();

    await loadTransparency();

    updateProgress();

    updateStatistics();

}


// =======================================================
// Create Gift Boxes
// =======================================================

function createGiftBoxes() {

    boxesContainer.innerHTML = "";

    for (let i = 1; i <= 10; i++) {

        const box = document.createElement("button");

        box.className = "gift-box";

        box.type = "button";

        box.innerHTML = `
            <div class="gift-icon">🎁</div>
            <div class="gift-number">Gift ${i}</div>
        `;

        box.addEventListener("click", handleDraw);

        boxesContainer.appendChild(box);

    }

}


// =======================================================
// Load Assigned Months
// =======================================================

async function loadAssignedMonths() {

    assignedMonths = [];

    const snapshot = await getDocs(
        collection(db, PARTICIPANTS)
    );

    snapshot.forEach((docSnap) => {

        const data = docSnap.data();

        if (data.assignedMonth) {

            assignedMonths.push(data.assignedMonth);

        }

    });

}
