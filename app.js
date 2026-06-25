alert("Contribution Draw starting");

const googleBtn = document.getElementById("googleBtn");
const agreeBox = document.getElementById("agreeBox");
const userSection = document.getElementById("userSection");
const displayNameInput = document.getElementById("displayName");
const saveNameBtn = document.getElementById("saveNameBtn");

let currentUser = null;
let isAdmin = false;

googleBtn.addEventListener("click", async () => {

  if (!agreeBox.checked) {
    alert("Please accept the Terms and Conditions first.");
    return;
  }

  alert(
    "Authentication setup successful. Sign-in code coming in Part 2."
  );

  userSection.style.display = "block";

});

saveNameBtn.addEventListener("click", () => {

  const name = displayNameInput.value.trim();

  if (!name) {
    alert("Please enter a name.");
    return;
  }

  alert("Name saved: " + name);

});
