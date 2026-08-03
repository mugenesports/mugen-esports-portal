import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 1. Firebase Configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 2. Initialize Firebase & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Reference to "teams" collection in Firestore
const teamsRef = collection(db, "teams");

// 3. READ DATA (For index.html)
// FIXED: ID updated from 'team-list' to 'player-list' to match index.html
const teamsList = document.getElementById("player-list");

// 4. CONNECT HTML FORM EVENTS
document.addEventListener("DOMContentLoaded", () => {
  
  if (teamsList) {
    // Real-time updates whenever data changes in the database
    onSnapshot(teamsRef, (snapshot) => {
      teamsList.innerHTML = ""; // Clear existing table rows
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

  // 5. WRITE DATA (For admin.html)
  const addTeamForm = document.getElementById("add-team-form");

  if (addTeamForm) {
    addTeamForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const team = document.getElementById("team").value;
      const rgGrind = parseInt(document.getElementById("rg-grind").value) || 0;
      const scrims = parseInt(document.getElementById("scrims").value) || 0;
      const homeSt = parseInt(document.getElementById("home-st").value) || 0;
      // FIXED: Matches 'outside-st' ID from admin.html
      const outsideSt = parseInt(document.getElementById("outside-st").value) || 0; 
      const plusPts = parseInt(document.getElementById("plus-pts").value) || 0;

      try {
        // FIXED: Changed 'teamRef' to 'teamsRef'
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

});
