import { auth, db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// =======================================
// Contribution Draw v1.0
// Draw Engine - Part 1
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
// DRAW ENGINE MODULE 1
// =======================================

function checkDrawEligibility() {

    // User signed in?
    if (!auth.currentUser) {

        alert("Please sign in first.");

        return false;

    }

    // Beneficiary name saved?
    if (
        !displayName ||
        displayName.value.trim() === ""
    ) {

        alert("Please save your beneficiary name first.");

        return false;

    }

    return true;

}

function initialiseDrawEngine() {

    document.querySelectorAll(".month-box")
        .forEach(box => {

            box.addEventListener("click", () => {

                if (!checkDrawEligibility()) return;

                alert(
                    "🎉 Congratulations!\n\nThe draw engine is now active.\n\nNext module will reveal your assigned month."
                );

            });

        });

}

initialiseDrawEngine();
