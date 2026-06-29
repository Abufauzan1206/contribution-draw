// =======================================
// Contribution Draw v1.0
// Draw Engine (Compatible Module)
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
// MATCH EXISTING STRUCTURE (DO NOT MODIFY)
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
// DOM ELEMENTS (SAFE BINDING)
// =======================================

const boxesContainer = document.getElementById("boxesContainer");
const latestSelection = document.getElementById("latestSelection");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");

// =======================================
// FIRESTORE HELPERS
// =======================================

async function getParticipants() {
    const snap = await getDocs(collection(db, "participants"));

    const list = [];
    snap.forEach(docSnap => {
        list.push(docSnap.data());
    });

    return list;
}

async function getTakenMonths() {
    const participants = await getParticipants();

    return participants
        .map(p => p.selectedMonth)
        .filter(Boolean);
}

async function getAvailableMonths() {
    const taken = await getTakenMonths();
    return MONTHS.filter(m => !taken.includes(m));
}

// =======================================
// ELIGIBILITY CHECK (MATCH SCRIPT.JS LOGIC)
// =======================================

async function checkEligibility() {

    const user = auth.currentUser;

    if (!user) {
        alert("Please sign in first.");
        return false;
    }

    const ref = doc(db, "participants", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        alert("Please save your beneficiary name first.");
        return false;
    }

    const data = snap.data();

    if (!data.beneficiaryName) {
        alert("Please save your beneficiary name first.");
        return false;
    }

    if (data.selectedMonth) {
        alert("You have already selected a month.");
        return false;
    }

    return true;
}

// =======================================
// RENDER BOXES
// =======================================

async function renderBoxes() {

    if (!boxesContainer) return;

    const taken = await getTakenMonths();

    boxesContainer.innerHTML = "";

    MONTHS.forEach((month, index) => {

        const box = document.createElement("button");

        box.className = "month-box";
        box.dataset.month = month;

        const isTaken = taken.includes(month);

        if (isTaken) {
            box.classList.add("locked");
            box.disabled = true;
        }

        box.innerHTML = `
            <div class="gift-icon">🎁</div>
            <div class="box-question">${isTaken ? "X" : "?"}</div>
            <div class="box-number">Box ${index + 1}</div>
            <div class="box-footer">
                ${isTaken ? "Taken" : "Tap to Draw"}
            </div>
        `;

        box.addEventListener("click", () => handleDraw(month));

        boxesContainer.appendChild(box);
    });

    updateProgress(taken.length);
}

// =======================================
// HANDLE DRAW ACTION
// =======================================

async function handleDraw(month) {

    const ok = await checkEligibility();
    if (!ok) return;

    const user = auth.currentUser;

    const available = await getAvailableMonths();

    if (!available.includes(month)) {
        alert("❌ This month is already taken.");
        renderBoxes();
        return;
    }

    try {

        const ref = doc(db, "participants", user.uid);

        await setDoc(ref, {
            selectedMonth: month,
            updatedAt: new Date().toISOString()
        }, { merge: true });

        if (latestSelection) {
            latestSelection.innerHTML =
                `🎉 You selected <strong>${month}</strong>`;
        }

        alert("🎉 Draw successful: " + month);

        renderBoxes();

    } catch (err) {
        console.error(err);
        alert("Draw failed. Please try again.");
    }
}

// =======================================
// PROGRESS UPDATE
// =======================================

function updateProgress(selectedCount) {

    if (!progressText || !progressFill) return;

    const total = MONTHS.length;

    progressText.textContent =
        `${selectedCount} of ${total} months selected`;

    progressFill.style.width =
        (selectedCount / total) * 100 + "%";
}

// =======================================
// INIT (SAFE AUTO START)
// =======================================

function initDraw() {
    renderBoxes();
}

// wait for DOM + auth readiness indirectly
window.addEventListener("load", () => {
    initDraw();
});
