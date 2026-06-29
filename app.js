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
  alert("Logged in as: " + user.email);

  isAdmin =
    user.email.toLowerCase() ===
    ADMIN_EMAIL.toLowerCase();
  
  alert("isAdmin = " + isAdmin);

  userSection.style.display = "block";

  if (isAdmin) {alert("Admin detected");

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

  await addDoc(collection(db, "beneficiaries"), {
  beneficiary1: name1,
  beneficiary2: name2,
  adminEmail: currentUser.email,
  createdAt: serverTimestamp()
});

alert("Beneficiary names saved successfully!");

} else {

  try {

  await addDoc(collection(db, "participants"), {
    name: name1,
    email: currentUser.email,
    uid: currentUser.uid,
    createdAt: serverTimestamp()
  });

  alert("Name saved successfully!");

} catch (error) {

  alert("Firestore error: " + error.message);
  console.error(error);

}

}

});
