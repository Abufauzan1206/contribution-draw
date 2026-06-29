alert("Contribution Draw starting");

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleBtn = document.getElementById("googleBtn");
const agreeBox = document.getElementById("agreeBox");
const userSection = document.getElementById("userSection");
const displayNameInput = document.getElementById("displayName");
const saveNameBtn = document.getElementById("saveNameBtn");

let currentUser = null;
let isAdmin = false;

onAuthStateChanged(auth, (user) => {

  if (!user) return;

  currentUser = user;

  isAdmin =
    user.email.toLowerCase() ===
    ADMIN_EMAIL.toLowerCase();

  userSection.style.display = "block";

  if (isAdmin) {

    document.getElementById("nameTitle").innerText =
      "Enter Two Beneficiary Names";

    document.getElementById("displayName2").style.display =
      "block";

  }

  alert("Signed in as " + user.email);

});

googleBtn.addEventListener("click", async () => {

  if (!agreeBox.checked) {
    alert("Please accept the Terms and Conditions first.");
    return;
  }

  try {

    const provider = new GoogleAuthProvider();

    await signInWithPopup(auth, provider);

  } catch (error) {

    alert(error.message);

  }

});

saveNameBtn.addEventListener("click", async () => {

  const name1 = displayNameInput.value.trim();

if (!name1) {
  alert("Please enter a beneficiary name.");
  return;
}

if (isAdmin) {

  const name2 =
    document.getElementById("displayName2")
    .value.trim();

  if (!name2) {
    alert("Please enter the second beneficiary name.");
    return;
  }

  alert(
    "Admin names saved:\n" +
    name1 +
    "\n" +
    name2
  );

} else {

  alert("Name saved: " + name1);

}

});
