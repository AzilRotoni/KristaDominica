//FIREBASE
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js"; //App
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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

//var for Database and Firestore
const CollectionOfInput = collection(firestore, "Admin")

//LOG IN INFORMATION
const login = document.getElementById("login")
login.addEventListener("click", async function(){
    let usernameInput = document.getElementById("username").value
    let passwordInput = document.getElementById("password").value
    let querySnapshot = await getDocs(CollectionOfInput);
    let userfound = false
    let adminID = ""
    
    querySnapshot.forEach((doc) => {
        let data = doc.data()
        let username = data.username
        let password = data.Password

        if (usernameInput === username && passwordInput === password ){
            userfound = true
            adminID = doc.id
        }
    })
    if(!userfound){
        const alertContainer = document.getElementById('alertContainer');
        const alertContent = document.getElementById('alertContent');
        const closeAlertButton = document.getElementById('closeAlert');

        alertContent.textContent = "Wrong Username or Password";
        alertContainer.style.bottom = '20px';
        alertContainer.classList.remove('hidden');

        closeAlertButton.addEventListener('click', closeAlert);
        setTimeout(() => {
            closeAlert();
        }, 5000);
    }else {
        let adminDocRef = doc(firestore, "Admin", adminID);
        let adminDocSnapshot = await getDoc(adminDocRef);

        if (adminDocSnapshot.exists()) {
            const adminData = adminDocSnapshot.data();

            console.log("First Name:", adminData.First_Name);
            console.log("Role:", adminData.Role);

            window.location.href = "AdminPage.html";
        } else {
            console.log("Admin document not found");
        }
    }
})

/*
===========================================================================================================
    EVENT-DRIVEN
===========================================================================================================
*/
// Check screen width and redirect if below 1204px
function checkScreenWidth() {
    var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (screenWidth <= 768) {
        window.location.href = "/AzilRotoni/KristaDominica/Admin121722/404/Admin404Page.html";
    }
}
window.onload = checkScreenWidth;
window.addEventListener("resize", checkScreenWidth);

//Show Password
const showPassword = document.getElementById("isShowPassword")
showPassword.addEventListener("click", function(){
    let passwordInput = document.getElementById('password');
    showPassword.addEventListener('change', function () {
        passwordInput.type = this.checked ? 'text' : 'password';
    });
})

// Function to close the alert
function closeAlert() {
    const alertContainer = document.getElementById('alertContainer');
    alertContainer.style.bottom = '-100px';
    setTimeout(() => {
        alertContainer.classList.add('hidden');
    }, 500);
    
}
