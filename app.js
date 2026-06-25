alert("Contribution Draw starting");

const googleBtn = document.getElementById("googleBtn");
const agreeBox = document.getElementById("agreeBox");

googleBtn.addEventListener("click", async () => {

  if (!agreeBox.checked) {
    alert("Please accept the Terms and Conditions first.");
    return;
  }

  alert("Google Sign-In coming next.");

});
