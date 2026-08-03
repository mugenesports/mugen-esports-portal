import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  setDoc,
  doc,
  onSnapshot 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const auth = getAuth();

// If user is NOT logged in, send them to login.html
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

// 1. Firebase Configuration (Ensure your keys are pasted here)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 2. Initialize Services
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// References
const teamsRef = collection(db, "teams");
const teamsList = document.getElementById("player-list");

// 3. EVENT LISTENERS
document.addEventListener("DOMContentLoaded", () => {
  
  // --- A. LEADERBOARD REAL-TIME READ (index.html) ---
  if (teamsList) {
    onSnapshot(teamsRef, (snapshot) => {
      teamsList.innerHTML = "";
      snapshot.forEach((doc) => {
        const data = doc.data();
        const row = `
          <tr>
            <td><strong>${data.team || ''}</strong></td>
            <td>${data.rgGrind ?? 0}</td>
            <td>${data.scrims ?? 0}</td>
            <td>${data.homeSt ?? 0}</td>
            <td>${data.outsideSt ?? 0}</td>
            <td>${data.plusPts ?? 0}</td>
          </tr>
        `;
        teamsList.innerHTML += row;
      });
    });
  }

  // --- B. ADMIN FORM WRITE (admin.html) ---
  const addTeamForm = document.getElementById("add-team-form");
  if (addTeamForm) {
    addTeamForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const team = document.getElementById("team").value;
      const rgGrind = parseInt(document.getElementById("rg-grind").value) || 0;
      const scrims = parseInt(document.getElementById("scrims").value) || 0;
      const homeSt = parseInt(document.getElementById("home-st").value) || 0;
      const outsideSt = parseInt(document.getElementById("outside-st").value) || 0; 
      const plusPts = parseInt(document.getElementById("plus-pts").value) || 0;

      try {
        await addDoc(teamsRef, { 
          team,
          rgGrind,
          scrims,
          homeSt,
          outsideSt,
          plusPts,
          updatedAt: new Date()
        });

        alert(`Successfully saved stats for ${team}!`);
        addTeamForm.reset();
      } catch (error) {
        console.error("Error adding document: ", error);
        alert("Error saving stats: " + error.message);
      }
    });
  }

  // --- C. PLAYER REGISTRATION (login.html) ---
  const registerForm = document.getElementById("form-register");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("reg-email").value;
      const password = document.getElementById("reg-password").value;
      const team = document.getElementById("team").value;
      const fullName = document.getElementById("reg-name").value;
      const ign = document.getElementById("ign").value;
      const mlId = document.getElementById("id").value;
      const server = document.getElementById("server").value;
      const bdate = document.getElementById("bdate").value;
      const location = document.getElementById("location").value;

      try {
        // 1. Create Auth Account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. Save Profile Details to "users" collection
        await setDoc(doc(db, "users", user.uid), {
          fullName,
          ign,
          mlId,
          server,
          team,
          bdate,
          location,
          email,
          createdAt: new Date()
        });

        alert("Registration successful! Welcome to Mugen Esports.");
        window.location.href = "index.html"; // Redirect to dashboard
      } catch (error) {
        console.error("Registration error:", error);
        alert("Registration failed: " + error.message);
      }
    });
  }

  // --- D. PLAYER LOGIN (login.html) ---
  const loginForm = document.getElementById("form-login");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in successfully!");
        window.location.href = "index.html"; // Redirect to dashboard
      } catch (error) {
        console.error("Login error:", error);
        alert("Login failed: " + error.message);
      }
    });
  }

});
