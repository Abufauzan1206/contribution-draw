// =======================================
// Contribution Draw v1.0
// Draw Engine - Part 1
// =======================================

alert("NEW DRAW.JS LOADED");

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

const boxesContainer =
    document.getElementById("boxesContainer");

// Create the hidden month boxes

function createDrawBoxes() {

    boxesContainer.innerHTML = "";

    MONTHS.forEach((month, index) => {

        const box = document.createElement("button");

        box.className = "month-box";

        box.dataset.month = month;

        box.innerHTML = `
            <div class="box-number">${index + 1}</div>
            <div class="box-text">?</div>
        `;

        boxesContainer.appendChild(box);

    });

}

createDrawBoxes(function createDrawBoxes() {

    boxesContainer.innerHTML = "";

    MONTHS.forEach((month, index) => {

        const box = document.createElement("button");

        box.className = "month-box";

        box.dataset.month = month;

        box.innerHTML = `
            <div class="gift-icon">🎁</div>

            <div class="box-number">
                Box ${index + 1}
            </div>

            <div class="box-question">
                ?
            </div>

            <div class="box-footer">
                Tap to Draw
            </div>
        `;

        boxesContainer.appendChild(box);

    });

}
