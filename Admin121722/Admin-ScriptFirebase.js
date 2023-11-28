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
    apiKey: "AIzaSyBzLcJDzNngZxCYOZiV5fXxffJgU4C1tZQ",
    authDomain: "teacker-kd-amad.firebaseapp.com",
    projectId: "teacker-kd-amad",
    storageBucket: "teacker-kd-amad.appspot.com",
    messagingSenderId: "671675614820",
    appId: "1:671675614820:web:8d5d0a0eab4a982660c171",
    measurementId: "G-5WQHME8RBY"
};

//URL for Realtime Database
const appSetting = {
  databaseURL: "https://teacker-kd-amad-default-rtdb.asia-southeast1.firebasedatabase.app/" //link of my Database
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);