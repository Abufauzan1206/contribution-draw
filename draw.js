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

// =======================================
// Contribution Draw v1.0
// draw.js
// Part 2 of 5
// Gift box events and random month selection
// =======================================


// =======================================
// Attach click events to every gift box
// =======================================

giftBoxes.forEach((box) => {

    box.addEventListener("click", async () => {

        await handleGiftBoxClick(box);

    });

});


// =======================================
// Main Draw Handler
// =======================================

async function handleGiftBoxClick(box) {

    // Must be signed in
    if (!currentUser) {
        alert("Please sign in first.");
        return;
    }

    // Prevent rapid multiple taps
    if (drawInProgress) {
        return;
    }

    drawInProgress = true;

    try {

        // Check whether this participant already has a month
        const existingMonth = await getParticipantMonth();

        if (existingMonth) {

            alert(
                `You have already been assigned ${existingMonth}.`
            );

            drawInProgress = false;
            return;
        }

        // Refresh assigned months from Firebase
        await loadAssignedMonths();

        // Secret random month
        const selectedMonth = getRandomAvailableMonth();

        if (!selectedMonth) {

            alert("All available months have been assigned.");

            drawInProgress = false;
            return;
        }

        // Small visual feedback
        box.classList.add("selected");

        // Continue in Part 3
        await saveParticipantAssignment(selectedMonth);

        box.classList.remove("selected");

    } catch (error) {

        console.error(error);

        alert("Unable to complete the draw.");

    }

    drawInProgress = false;

}



// =======================================
// Check if current participant already has
// an assigned month
// =======================================

async function getParticipantMonth() {

    const participantRef = doc(
        db,
        PARTICIPANTS_COLLECTION,
        currentUser.uid
    );

    const snapshot = await getDoc(participantRef);

    if (!snapshot.exists()) {
        return null;
    }

    const data = snapshot.data();

    return data.assignedMonth || null;

}



// =======================================
// Random Available Month
// =======================================

function getRandomAvailableMonth() {

    // Remove months already assigned
    const availableMonths = DRAW_MONTHS.filter((month) => {

        return !assignedMonths.includes(month);

    });

    if (availableMonths.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(
        Math.random() * availableMonths.length
    );

    return availableMonths[randomIndex];

}

// =======================================
// Contribution Draw v1.0
// draw.js
// Part 3 of 5
// Save assignment to Firebase
// =======================================


// =======================================
// Save participant assignment
// =======================================

async function saveParticipantAssignment(selectedMonth) {

    // Participant document
    const participantRef = doc(
        db,
        PARTICIPANTS_COLLECTION,
        currentUser.uid
    );

    const participantData = {
        uid: currentUser.uid,
        name: currentUser.displayName || "Anonymous",
        email: currentUser.email || "",
        assignedMonth: selectedMonth,
        assignedAt: serverTimestamp()
    };

    // Save participant
    await setDoc(participantRef, participantData);

    // Update local cache
    assignedMonths.push(selectedMonth);

    // Save to Hall of Transparency
    await saveTransparencyRecord(participantData);

    // Refresh UI (implemented in Part 4)
    await loadHallOfTransparency();
    await updateLatestSelection(participantData);
    await updateProgress();

    alert(`Congratulations! Your assigned month is ${selectedMonth}.`);

}



// =======================================
// Save record to Hall of Transparency
// =======================================

async function saveTransparencyRecord(participant) {

    await addDoc(

        collection(db, TRANSPARENCY_COLLECTION),

        {
            uid: participant.uid,
            name: participant.name,
            email: participant.email,
            assignedMonth: participant.assignedMonth,
            assignedAt: serverTimestamp()
        }

    );

}

// =======================================
// Contribution Draw v1.0
// draw.js
// Part 4 of 5
// Hall of Transparency & UI Updates
// =======================================

import {
    query,
    orderBy,
    limit
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


// =======================================
// Load Hall of Transparency
// =======================================

async function loadHallOfTransparency() {

    if (!hallContainer) return;

    hallContainer.innerHTML = "";

    const transparencyQuery = query(
        collection(db, TRANSPARENCY_COLLECTION),
        orderBy("assignedAt", "desc")
    );

    const snapshot = await getDocs(transparencyQuery);

    snapshot.forEach((document) => {

        const data = document.data();

        const row = document.createElement("div");
        row.className = "transparency-row";

        row.innerHTML = `
            <strong>${data.name}</strong>
            <br>
            ${data.assignedMonth}
        `;

        hallContainer.appendChild(row);

    });

}



// =======================================
// Update Latest Selection
// =======================================

async function updateLatestSelection(participant = null) {

    if (!latestSelection) return;

    // If participant supplied, update immediately
    if (participant) {

        latestSelection.textContent =
            `${participant.name} → ${participant.assignedMonth}`;

        return;
    }

    // Otherwise load latest from Firebase
    const latestQuery = query(
        collection(db, TRANSPARENCY_COLLECTION),
        orderBy("assignedAt", "desc"),
        limit(1)
    );

    const snapshot = await getDocs(latestQuery);

    if (snapshot.empty) {

        latestSelection.textContent = "No selections yet.";

        return;

    }

    const latest = snapshot.docs[0].data();

    latestSelection.textContent =
        `${latest.name} → ${latest.assignedMonth}`;

}



// =======================================
// Update Progress
// =======================================

async function updateProgress() {

    const assignedCount = assignedMonths.length;

    if (progressText) {

        progressText.textContent =
            `${assignedCount} / ${TOTAL_AVAILABLE_MONTHS} Assigned`;

    }

    if (progressBar) {

        const percentage =
            (assignedCount / TOTAL_AVAILABLE_MONTHS) * 100;

        progressBar.style.width = percentage + "%";

    }

        }
