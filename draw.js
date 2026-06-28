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
