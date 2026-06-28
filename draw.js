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

createDrawBoxes();
