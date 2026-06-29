import { auth, db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
// =======================================
// Contribution Draw v1.0
// Draw Engine - Part 1
// =======================================
import { auth, db } from "./firebase.js";

import {
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

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

const boxesContainer = document.getElementById("boxesContainer");

function createDrawBoxes() {

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
// MODULE 1 - DRAW FOUNDATION
// =======================================

async function canUserDraw() {

    const user = auth.currentUser;

    if (!user) {
        alert("Please sign in first.");
        return false;
    }

    const userDoc = await getDoc(doc(db, "participants", user.uid));

    if (!userDoc.exists()) {
        alert("Please save your beneficiary name first.");
        return false;
    }

    const data = userDoc.data();

    if (data.month) {
        alert("You have already selected a month.");
        return false;
    }

    return true;
}

function attachBoxEvents() {

    document.querySelectorAll(".month-box").forEach(box => {

        box.addEventListener("click", async () => {

            const allowed = await canUserDraw();

            if (!allowed) return;

            alert("✅ Draw engine ready.\n\nNext module will assign your month.");

        });

    });

}

attachBoxEvents();
