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

// =======================================================
// Contribution Draw v1.1
// draw.js
// Section 2 of 4
// Draw Engine
// =======================================================


// =======================================================
// Handle Draw
// =======================================================

async function handleDraw() {

    if (!currentUser) {

        alert("Please sign in with Google first.");

        return;

    }

    if (drawBusy) return;

    drawBusy = true;

    try {

        // Check whether participant already has a month
        const participantRef = doc(
            db,
            PARTICIPANTS,
            currentUser.uid
        );

        const participantSnap =
            await getDoc(participantRef);

        if (participantSnap.exists()) {

            const data = participantSnap.data();

            if (data.assignedMonth) {

                alert(
                    `You already own ${data.assignedMonth}.`
                );

                drawBusy = false;

                return;

            }

        }

        // Refresh assigned months
        await loadAssignedMonths();

        // Determine available months
        const availableMonths =
            MONTHS.filter(month =>
                !assignedMonths.includes(month)
            );

        if (availableMonths.length === 0) {

            alert("All public months have been assigned.");

            drawBusy = false;

            return;

        }

        // Secret random assignment
        const assignedMonth =
            availableMonths[
                Math.floor(
                    Math.random() *
                    availableMonths.length
                )
            ];

        await saveAssignment(assignedMonth);

    } catch (error) {

        console.error(error);

        alert("Unable to complete draw.");

    }

    drawBusy = false;

}



// =======================================================
// Save Assignment
// =======================================================

async function saveAssignment(month) {

    const participant = {

        uid: currentUser.uid,

        email: currentUser.email,

        name:
            currentUser.displayName ||
            "Participant",

        assignedMonth: month,

        assignedAt: serverTimestamp()

    };

    // Save participant
    await setDoc(

        doc(
            db,
            PARTICIPANTS,
            currentUser.uid
        ),

        participant

    );

    // Hall of Transparency
    await addDoc(

        collection(
            db,
            TRANSPARENCY
        ),

        participant

    );

    assignedMonths.push(month);

    latestSelection.textContent =
        `${participant.name} selected ${month}`;

    alert(
        `Congratulations!\n\nYour assigned month is ${month}.`
    );

    await loadTransparency();

    updateProgress();

    updateStatistics();

    }
