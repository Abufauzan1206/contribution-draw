// =======================================
// Contribution Draw v1.0
// Draw Engine
// Part 1 of 5
// =======================================

import { auth, db } from "./firebase.js";

import {
    doc,
    getDoc,
    getDocs,
    setDoc,
    collection
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// =======================================
// Months
// =======================================

const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "July",
    "August",
    "September",
    "October",
    "November"
];

// =======================================
// DOM Elements
// =======================================

const boxesContainer =
    document.getElementById("boxesContainer");

const progressFill =
    document.getElementById("progressFill");

const progressText =
    document.getElementById("progressText");

const latestSelection =
    document.getElementById("latestSelection");

const drawStatus =
    document.getElementById("drawStatus");

// =======================================
// Create Gift Boxes
// =======================================

function createDrawBoxes() {

    if (!boxesContainer) return;

    boxesContainer.innerHTML = "";

    MONTHS.forEach((month, index) => {

        const box = document.createElement("button");

        box.className = "month-box";

        box.dataset.month = month;

        box.innerHTML = `
            <div class="gift-icon">🎁</div>
            <div class="box-question">?</div>
            <div class="box-number">Box ${index + 1}</div>
            <div class="box-footer">Tap to Draw</div>
        `;

        boxesContainer.appendChild(box);

    });

}

createDrawBoxes();

// =======================================
// Check Draw Eligibility
// =======================================

async function checkDrawEligibility() {

    const user = auth.currentUser;

    if (!user) {

        alert("Please sign in with Google first.");

        return false;

    }

    const participantRef =
        doc(db, "participants", user.uid);

    const participantSnap =
        await getDoc(participantRef);

    if (!participantSnap.exists()) {

        alert("Please save your beneficiary name first.");

        return false;

    }

    const participant =
        participantSnap.data();

    if (!participant.beneficiaryName) {

        alert("Please save your beneficiary name first.");

        return false;

    }

    if (participant.selectedMonth) {

        alert(
            "You have already selected " +
            participant.selectedMonth
        );

        return false;

    }

    return true;

    }
