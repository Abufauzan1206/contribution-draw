// ==========================================
// Contribution Draw v1.0
// auth.js
// Designed & Powered by ABUFAUZAN TECH
// ==========================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Administrator email
const ADMIN_EMAIL = "YOUR_ADMIN_EMAIL_HERE";

// Current logged-in user
let currentUser = null;
let isAdmin = false;

// HTML Elements
const googleSignInBtn = document.getElementById("googleSignInBtn");
const signOutBtn = document.getElementById("signOutBtn");
const userSection = document.getElementById("userSection");
const welcomeMessage = document.getElementById("welcomeMessage");
const loadingOverlay = document.getElementById("loadingOverlay");
