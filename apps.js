import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, onSnapshot } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

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

// Reference to "players" collection in Firestore
const playersRef = collection(db, "teams");

// 3. READ DATA (For index.html)
const teamList = document.getElementById("player-list");

if (teamList) {
  // Real-time updates whenever data changes in the database
  onSnapshot(teamsRef, (snapshot) => {
    teamList.innerHTML = ""; // Clear existing table rows
    snapshot.forEach((doc) => {
      const data = doc.data();
      const row = `
        <tr>
          <td><strong>${data.team}</strong></td>
          <td>${data.rg-grind}</td>
          <td>${data.scrims}</td>
          <td>${data.home-st}</td>
          <td>${data.outside-st}</td>
          <td>${data.plus-pts}</td>
        </tr>
      `;
      teamList.innerHTML += row;
    });
  });
}

// 4. WRITE DATA (For admin.html)
const addTeamForm = document.getElementById("add-team-form");

if (addTeamForm) {
  addTeamForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const team = document.getElementById("team").value;
    const rg grind = parseInt(document.getElementById("rg-grind").value;
    const scrims = parseInt(document.getElementById("scrims").value;
    const home st = parseInt(document.getElementById("home-st").value);
    const outside st = parseInt(document.getElementById("outside-st").value);
    const plus pts = parseInt(document.getElementById("plus-pts").value);

    try {
      await addDoc(teamRef, {
        team,
        rg grind,
        scrims,
        home st,
        outside st,
        plus pts
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