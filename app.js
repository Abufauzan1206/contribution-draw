alert("Contribution Draw loaded");

const googleBtn = document.getElementById("googleBtn");
const agreeBox = document.getElementById("agreeBox");

googleBtn.addEventListener("click", () => {

  if (!agreeBox.checked) {
    alert("Please accept the Terms and Conditions first.");
    return;
  }

  alert("Google Sign-In will start here.");
});
