// =======================================
// Contribution Draw v1.0
// Draw Engine
// Part 1 of 5
// =======================================

import {
    doc,
    getDoc,
    getDocs,
    setDoc,
    addDoc,
    collection
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
// =======================================
// Months
// =======================================

const MONTHS = [
    "June",      // Reserved for Admin
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

// =======================================
// Get Available Months
// =======================================

async function getAvailableMonths() {

    const snapshot =
        await getDocs(collection(db, "participants"));

    const takenMonths = [];

    snapshot.forEach(docSnap => {

        const data = docSnap.data();

        if (data.selectedMonth) {

            takenMonths.push(data.selectedMonth);

        }

    });

    return MONTHS.filter(month =>

    month !== "June" &&

    !takenMonths.includes(month)

);

}

// =======================================
// Assign Random Month
// =======================================

async function assignRandomMonth() {

    const user = auth.currentUser;

    if (!user) return null;

    const availableMonths =
        await getAvailableMonths();

    if (availableMonths.length === 0) {

        alert("All months have already been assigned.");

        return null;

    }

    const randomIndex =
        Math.floor(Math.random() * availableMonths.length);

    const selectedMonth =
        availableMonths[randomIndex];

    const participantRef =
        doc(db, "participants", user.uid);

    const participantSnap =
        await getDoc(participantRef);

    const participant =
        participantSnap.data();

    await setDoc(participantRef, {

        ...participant,

        selectedMonth: selectedMonth,

        updatedAt: new Date().toISOString()

    });

    const user = auth.currentUser;

if (user) {

    try {

        await addDoc(collection(db, "transparency"), {

            beneficiaryName: participant.beneficiaryName || "Unknown",
            month: selectedMonth,
            email: user.email || "",
            uid: user.uid,
            timestamp: new Date().toISOString()

        });

        console.log("Transparency saved");

    } catch (err) {

        console.error("Transparency write failed:", err);

    }

}

    try {

    await addDoc(collection(db, "transparency"), {

        beneficiaryName: participant.beneficiaryName || "Unknown",
        month: selectedMonth,
        email: user.email || "",
        uid: user.uid,
        timestamp: new Date().toISOString()

    });

    console.log("Transparency saved");

} catch (err) {
    console.error("Transparency write failed:", err);
    }

    await addDoc(collection(db, "transparency"), {

    beneficiaryName: participant.beneficiaryName,

    month: selectedMonth,

    email: user.email,

    uid: user.uid,

    timestamp: new Date().toISOString()

});

    return selectedMonth;

}

// =======================================
// Initialise Draw Engine
// =======================================

function initialiseDrawEngine() {

    document.querySelectorAll(".month-box")
        .forEach(box => {

            box.addEventListener("click", async () => {

                const eligible =
                    await checkDrawEligibility();

                if (!eligible) return;

                const selectedMonth =
                    await assignRandomMonth();

                if (!selectedMonth) return;

                alert(
                    "🎉 Congratulations!\n\nYour assigned month is:\n\n" +
                    selectedMonth
                );

                if (latestSelection) {

                    latestSelection.textContent =
                        selectedMonth;

                }

                if (drawStatus) {

                    drawStatus.textContent =
                        "✅ Draw completed successfully.";

                }

            });

        });

}

initialiseDrawEngine();

// =======================================
// Hall of Transparency - Load Records
// =======================================

const selectionHistory =
    document.getElementById("selectionHistory");

async function loadTransparency() {

    if (!selectionHistory) return;

    try {

        const snapshot =
            await getDocs(collection(db, "transparency"));

        selectionHistory.innerHTML = "";

        if (snapshot.empty) {

            selectionHistory.innerHTML =
                `<p class="empty-message">No selections have been recorded yet.</p>`;

            return;

        }

        snapshot.forEach(docSnap => {

            const data = docSnap.data();

            const item = document.createElement("div");

            item.className = "history-item";

            item.innerHTML = `
                <p><strong>${data.beneficiaryName}</strong></p>
                <p>Month: ${data.month}</p>
                <p>${new Date(data.timestamp).toLocaleString()}</p>
                <hr>
            `;

            selectionHistory.appendChild(item);

        });

    } catch (error) {

        console.error(error);

    }

}

// Load when page opens
loadTransparency();
