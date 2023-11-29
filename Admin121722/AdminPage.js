import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js"; //App
import { collection, getFirestore, query, where, getDocs} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js"; //Firestore//

const firebaseConfig = {
    apiKey: "AIzaSyAIlhhNKiXBy2stX9HsebtxaDfB-F535LI",
    authDomain: "teacher-kd-amad.firebaseapp.com",
    projectId: "teacher-kd-amad",
    storageBucket: "teacher-kd-amad.appspot.com",
    messagingSenderId: "623162023007",
    appId: "1:623162023007:web:dd7f6118a43c1b0a038fea",
    measurementId: "G-8VW1ZR77HP"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
/*
===========================================================================================================
    EVENT-DRIVEN
===========================================================================================================
*/

document.addEventListener('DOMContentLoaded', function (e) {
    e.preventDefault
    
    //Prevent unwanted users
    if (sessionStorage.getItem('reloaded') === null || sessionStorage.getItem('reloaded') === 'yes') {
        console.log('page is refreshed 1')
        async function checkUserCredentials() {
        const usersCollection = collection(firestore, 'Admin');
        const username = sessionStorage.getItem('username');
        console.log('Test 1: ' + username)

        const q = query(usersCollection, where('username', '==', username));
        console.log('Test 2: ' + q)
        getDocs(q)
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    console.log("User is not signed in");
                    window.location.href = 'index.html';
                }
            })
            .catch((error) => {
                console.error('Error checking user credentials:', error);
            });
        }
        checkUserCredentials();
    }else{
        if (typeof(Storage) !== "undefined") {
            window.addEventListener('beforeunload', function() {
                sessionStorage.clear();
            });
        }   
    }
    sessionStorage.setItem('reloaded', 'yes');

    // Load the Animated SVG
    let fname = sessionStorage.getItem('FirstName')
    let lname = sessionStorage.getItem('LastName')
    let role = sessionStorage.getItem('Role')
    document.getElementById('open').style.display = 'none';
    document.getElementById('close').style.display = 'block';
    document.getElementById("role").textContent = `${role}:`
    document.getElementById("role-fName").textContent = `${fname}`
    let animationShown = sessionStorage.getItem('animationShown');

    if (!animationShown) {
        showAdminPage(fname, lname, role);
    } else {
        simulateAdminLogin();
    }

    function simulateAdminLogin() {
        let svgContainer = document.getElementById('svg-container');
        svgContainer.id = 'svg-container-hidden';
        document.body.classList.add('show-admin-page');
    }
    function showAdminPage(fname, lname, role) {
        sessionStorage.setItem('animationShown', 'true');
        
        let svgContainer = document.getElementById('svg-container');
        if(svgContainer){
            document.body.classList.remove('show-admin-page');
            document.getElementById('open').style.display = 'none';
            document.getElementById('close').style.display = 'block';
            document.getElementById('greet').textContent = `Hello ${fname} ${lname} !!`;
        setTimeout(function () {
            svgContainer.id = 'svg-container-hidden';
            document.body.classList.add('show-admin-page');
            
        }, 2500);
        }
    }

    //Tool Tip
    const navLinks = document.querySelectorAll(".side-navlink");
    navLinks.forEach((link) => {
        link.addEventListener("mouseover", showTooltip);
        link.addEventListener("mouseout", hideTooltip);
    });
    function showTooltip(event) {
        const openElement = document.getElementById('open');
        if (openElement && getComputedStyle(openElement).display === 'none') {
            return;
        }
        const tooltipText = event.currentTarget.getAttribute("data-tooltip");
        const tooltip = createTooltip(tooltipText);
        event.currentTarget.appendChild(tooltip);
    }
    function hideTooltip() {
        const tooltip = event.currentTarget.querySelector(".tooltip");
        if (tooltip) {
            tooltip.remove();
        }
    }
    function createTooltip(text) {
        const tooltip = document.createElement("div");
        tooltip.classList.add("tooltip");
        tooltip.textContent = text;
        return tooltip;
    }
});

// Check screen width and redirect if below 768
function checkScreenWidth() {
    var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (screenWidth <= 768) {
        sessionStorage.setItem('currentURL', window.location.href)
        window.location.href = "404/Admin404Page.html";
    }
}
window.onload = checkScreenWidth;
window.addEventListener("resize", checkScreenWidth);

//Toggle Close and Open
var openButton = document.getElementById('open');
var closeButton = document.getElementById('close');
openButton.addEventListener('click', function() {
    openButton.classList.remove('active');
    closeButton.classList.add('active');

    openButton.style.display = 'none';
    closeButton.style.display = 'block';

    var sidebarLabels = document.getElementsByClassName('sidebar-label');
    for (var i = 0; i < sidebarLabels.length; i++) {
        sidebarLabels[i].style.display = 'block';
        sidebarLabels[i].classList.remove('hide');
    }
    document.getElementById('sidebar-container').style.width = '300px'
});
closeButton.addEventListener('click', function() {
    openButton.classList.add('active');
    closeButton.classList.remove('active');

    openButton.style.display = 'block';
    closeButton.style.display = 'none';

    var sidebarLabels = document.getElementsByClassName('sidebar-label');
    for (var i = 0; i < sidebarLabels.length; i++) {
        sidebarLabels[i].style.display = 'none';
        sidebarLabels[i].classList.add('hide');
    }
    document.getElementById('sidebar-container').style.width = '100px';
});
