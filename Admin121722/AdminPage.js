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

    //Page 404
    document.getElementById('page-404').style.display = 'none'

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
        showAdminPage(fname, lname);
    } else {
        simulateAdminLogin();
    }
    let AdminPage = document.getElementById('admin-page');
    function simulateAdminLogin() {
        let svgContainer = document.getElementById('svg-container');
        svgContainer.id = 'svg-container-hidden';
        let AdminPage = document.getElementById('admin-page');
        AdminPage.classList = 'show-admin-page';
    }
    function showAdminPage(fname, lname) {
        let svgContainer = document.getElementById('svg-container');
        sessionStorage.setItem('animationShown', 'true');
        
        if(svgContainer){
            svgContainer.id = 'svg-container';
            document.getElementById('open').style.display = 'none';
            document.getElementById('close').style.display = 'block';
            if(fname !== null){
                document.getElementById('greet').textContent = `Hello ${fname} ${lname} !!`;
            }

        setTimeout(function () {
            svgContainer.id = 'svg-container-hidden';
            AdminPage.classList = 'show-admin-page';
        }, 2500);
        }
    }

    //Prevent unwanted users
    if (sessionStorage.getItem('reloaded') === null || sessionStorage.getItem('reloaded') === 'yes') {
        async function checkUserCredentials() {
        const usersCollection = collection(firestore, 'Admin');
        const username = sessionStorage.getItem('username');

        const q = query(usersCollection, where('username', '==', username));
        getDocs(q)
            .then((querySnapshot) => {
                if (querySnapshot.empty) {
                    sessionStorage.clear()
                    window.location.href = 'index.html';
                }
            })
            .catch((error) => {
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
    //Navinks Selector
    showSection('MyStudents'); //dashboard
    navLinks.forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const sectionClass = this.getAttribute('data-section');
            showSection(sectionClass);
        });
    });

    // Title
    document.getElementById('title').textContent = `DASHBOARD - ${role} ${fname}`;

    //===============================================================================================
    //STUDENTS ======================================================================================

    //List of Students

    const parentDiv = document.getElementById('listOfSection');
    if (sessionStorage.getItem('reloaded') === 'yes') {
        let uniqueSections
            const studentsCollectionRef = collection(firestore, 'MyStudents');
            getDocs(studentsCollectionRef)
            .then((querySnapshot) => {
                uniqueSections = [];
                querySnapshot.forEach((doc) => {
                const section = doc.data().Section;
                if (!uniqueSections.includes(section)) {
                    uniqueSections.push(section);
                }
                });
                console.log(uniqueSections);
                uniqueSections.forEach((section) => {
                    const sectionContainer = document.createElement('div');
                    sectionContainer.className = 'section-container';

                    const sectionContainerID = section.toLowerCase().replace(/\s+/g, '_');
                    sectionContainer.id = sectionContainerID;

                    const h2 = document.createElement('h2');
                    querySnapshot.forEach((doc) => {
                        if (doc.data().Section === section) {
                            const grade = doc.data().Grade;
                            h2.textContent = `G${grade} - ${section}`;
                        }
                    });
                    sectionContainer.appendChild(h2);
                    parentDiv.appendChild(sectionContainer);
                });
            })
            .catch((error) => {
                console.error('Error getting documents: ', error);
            });
    }
});

// Check screen width and redirect if below 768
function checkScreenWidth() {
    var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (screenWidth <= 770) {
        document.getElementById('Main').style.display = 'none';
        document.getElementById('page-404').style.display = 'block'
    }else if(screenWidth <= 770 || !sessionStorage.getItem('animationShown')){
        document.getElementById('page-404').style.display = 'none'
    }else{
        document.getElementById('Main').style.display = 'block';
        document.getElementById('page-404').style.display = 'none'
    }
}
// window.onload = checkScreenWidth;
// window.addEventListener("resize", checkScreenWidth);

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

//SIDE NAVLINKS
function showSection(sectionClass) {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    const selectedSection = document.querySelector(`.${sectionClass}`);
    if (selectedSection) {
        selectedSection.style.display = 'flex';
    }else{
        selectedSection.style.display = 'none';
    }
}
