/*
===========================================================================================================
    FIREBASE: Teacher-KD
===========================================================================================================
*/
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js"; //App
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-analytics.js"; //Analytics
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-auth.js"; //Authentication
import { getDatabase, ref, push} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js"; //Database
import { getFirestore, collection, getDoc, getDocs, doc} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js"; //Firestore

//Initialize Web App and Database
const firebaseConfig = {
    apiKey: "AIzaSyAIlhhNKiXBy2stX9HsebtxaDfB-F535LI",
    authDomain: "teacher-kd-amad.firebaseapp.com",
    projectId: "teacher-kd-amad",
    storageBucket: "teacher-kd-amad.appspot.com",
    messagingSenderId: "623162023007",
    appId: "1:623162023007:web:85e77a2817419f1e038fea",
    measurementId: "G-TCZLCT4SX2"
};

//URL for Realtime Database
const appSetting = {
  databaseURL: "https://teacker-kd-amad-default-rtdb.asia-southeast1.firebasedatabase.app/" //link of my Database
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);