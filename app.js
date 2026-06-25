const MONTHS = [
  "June",
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

const app = firebaseModules.initializeApp(firebaseConfig);
const auth = firebaseModules.getAuth(app);
const db = firebaseModules.getFirestore(app);

const googleBtn = document.getElementById("googleBtn");
const agreeBox = document.getElementById("agreeBox");
const userSection = document.getElementById("userSection");

let currentUser = null;

googleBtn.addEventListener("click", async () => {

  if (!agreeBox.checked) {
    alert("You must agree to the Terms and Conditions.");
    return;
  }

  alert(
    "Google Sign-In logic will be added in the next step."
  );

});
