/*
===========================================================================================================
    FIREBASE: Teacher-KD
===========================================================================================================
*/
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
/*
===========================================================================================================
    EVENT-DRIVEN
===========================================================================================================
*/

//LOG IN INFORMATION USING FIREBASE
const formBox = document.querySelector('.form .box');
let usernameTexrField = document.getElementById("username")
let passwordTextField = document.getElementById("password")
const login = document.getElementById("login")
login.addEventListener("click", async function(){
    let usernameInput = document.getElementById("username").value
    let passwordInput = document.getElementById("password").value

    const CollectionOfAdmin = collection(firestore, "Admin")
    let querySnapshot = await getDocs(CollectionOfAdmin);
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

        formBox.style.boxShadow = '0px 0px 20px 1px #780116';
    }else {
        let adminDocRef = doc(firestore, "Admin", adminID);
        let adminDocSnapshot = await getDoc(adminDocRef);

        if (adminDocSnapshot.exists()) {
            const adminData = adminDocSnapshot.data();
            
            console.log("First Name:", adminData["First Name"]);
            console.log("Last Name:", adminData["Last Name"]);
            console.log("Role:", adminData["Role"]);
            console.log("username:", adminData["username"]);
            sessionStorage.setItem('username', adminData["username"])
            sessionStorage.setItem('FirstName', adminData["First Name"])
            sessionStorage.setItem('LastName', adminData["Last Name"])
            sessionStorage.setItem('Role', adminData["Role"])

            // window.location.href = "/AdminPage.html";
            window.location.href = "AdminPage.html";

        }
    }
    document.getElementById("password").type = 'password';
    document.getElementById("isShowPassword").checked = false;
})
//re change the color
usernameTexrField.addEventListener('focus', function () {
    formBox.style.boxShadow = '0px 0px 20px 1px #ffbb763f'; 
});
passwordTextField.addEventListener('focus', function () {
    formBox.style.boxShadow = '0px 0px 20px 1px #ffbb763f';
});
passwordTextField.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        login.click();
    }
});
formBox.addEventListener('mouseout', function () {
    formBox.style.boxShadow = '';
});


// Check screen width and redirect if below 768
function checkScreenWidth() {
    var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (screenWidth <= 768) {
        localStorage.setItem('currentURL', window.location.href)
        window.location.href = "404/Admin404Page.html";
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
