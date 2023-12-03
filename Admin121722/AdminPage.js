import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js"; //App
import { collection, getFirestore, query, where, getDocs} from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js"; //Firestore//

const firebaseConfig = {
    apiKey: "AIzaSyAIlhhNKiXBy2stX9HsebtxaDfB-F535LI",
    authDomain: "teacher-kd-amad.firebaseapp.com",
    projectId: "teacher-kd-amad",
    storageBucket: "teacher-kd-amad.appspot.com",
    messagingSenderId: "623162023007",
    appId: "1:623162023007:web:dd7f6118a43c1b0a038fea",
    measurementId: "G-8VW1ZR77HP",
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

    // document.getElementById('Main').style.maxWidth = document.getElementById('Main').innerWidth + 'px';
    document.body.style.maxWidth = window.screen.width + 'px'
    closeSidebar();
    
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

    function simulateAdminLogin() {
        const svgContainer = document.getElementById('svg-container');
        const main = document.getElementById('Main');
        const sideNav = document.getElementById('side-navbar-container');

        svgContainer.classList = 'hidden-svg-container';
        main.classList = 'Main';
        sideNav.classList = 'side-navbar-container';
        sessionStorage.setItem('animationShown', 'true');
        document.getElementById('Main').style.display = 'block';
        document.getElementById('side-navbar-container').style.display = 'flex';
    }
    function showAdminPage(fname, lname) {
        sessionStorage.setItem('animationShown', 'true');
        const svgContainer = document.getElementById('svg-container');
        const main = document.getElementById('Main');
        const sideNav = document.getElementById('side-navbar-container');

        if(svgContainer){
            svgContainer.classList = 'svg-container';
            document.getElementById('open').style.display = 'none';
            document.getElementById('close').style.display = 'block';
            if(fname !== null){
                document.getElementById('greet').textContent = `Hello ${fname} ${lname} !!`;
            }
        setTimeout(function () {
            svgContainer.classList = 'hidden-svg-container';
            main.classList = 'Main';
            sideNav.classList = 'side-navbar-container';
            document.getElementById('Main').style.display = 'block';
            document.getElementById('side-navbar-container').style.display = 'flex';

        }, 3000); //3000
        }
    }

    //Prevent unwanted users
    let isAdmin = sessionStorage.getItem('isAdmin');
    if (!sessionStorage.getItem('reloaded')) {
        async function checkUserCredentials() {
            const username = sessionStorage.getItem('username');
            if (isAdmin === null) {
                const usersCollection = collection(firestore, 'Admin');
                const q = query(usersCollection, where('username', '==', username));
                const querySnapshot = await getDocs(q);
                if (!querySnapshot.empty) {
                    isAdmin = true;
                } else {
                    isAdmin = false;
                    sessionStorage.clear();
                    window.location.href = 'index.html';
                }
                // Cache the isAdmin status
                sessionStorage.setItem('isAdmin', isAdmin);
            }
        }
        checkUserCredentials();
    }else{
        if (typeof(Storage) !== "undefined") {
            window.addEventListener('beforeunload', function() {
                // sessionStorage.clear();
            });
        }   
    }
    sessionStorage.setItem('reloaded', 'yes');

    //Tool Tip
    const navLinks = document.querySelectorAll(".side-navlink1, .side-navlink2[data-tooltip]:not(:empty)");
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
    //STUDENTS 
    //======================================================================================

    //List of Students
    if (!sessionStorage.getItem('isSectionCollected')) {
    const ul_menu = document.getElementById('menu');
    let dropdowns;
    let uniqueSections;
    const studentsCollectionRef = collection(firestore, 'Sections');
    
    getDocs(studentsCollectionRef)
        .then((querySnapshot) => {
            uniqueSections = [];
            querySnapshot.forEach((doc) => {
                const sectionData = doc.data();
                const fieldNames = Object.keys(sectionData);
                fieldNames.sort();
                fieldNames.forEach((fieldName) => {
                    const li = document.createElement('li');
                    li.textContent = `${sectionData[fieldName]}`;
                    li.className = 'section';
                    ul_menu.appendChild(li);
                    sessionStorage.setItem(fieldName, sectionData[fieldName]);
                });
                sessionStorage.setItem('sections',JSON.stringify(Object.values(sectionData)))
            });
            dropdowns = document.querySelectorAll('.dropdown');
        })
        .catch((error) => {
            console.error('Error getting documents: ', error);
        })
        .finally(() => {
            if (dropdowns) {
                sessionStorage.setItem('isSectionCollected', 'yes')
                dropdowns.forEach((dropdown) => {
                    const select = dropdown.querySelector('.select');
                    const caret = dropdown.querySelector('.caret');
                    const menu = dropdown.querySelector('.menu');
                    const options = dropdown.querySelectorAll('.menu li');
                    const selected = dropdown.querySelector('.selected');

                    select.addEventListener('click', () => {
                        select.classList.toggle('select-clicked');
                        caret.classList.toggle('caret-rotate');
                        menu.classList.toggle('menu-open');
                    });

                    options.forEach(option => {
                        option.addEventListener('click', () =>{
                            selected.innerText = option.innerText;
                            select.classList.remove('select-clicked')
                            caret.classList.remove('caret-rotate')
                            menu.classList.remove('menu-open')

                            options.forEach(option =>{
                                option.classList.remove('active')
                            })
                            option.classList.add('active')
                            fillTable(option.innerText);
                        })
                    });
                });
            }
        });
    }else{
        const ul_menu = document.getElementById('menu');
        let dropdowns;
        const fieldNames = JSON.parse(sessionStorage.getItem('sections'))
        fieldNames.sort();
        fieldNames.forEach((fieldName) => {
            const li = document.createElement('li');
            li.textContent = `${fieldName}`;
            li.className = 'section';
            ul_menu.appendChild(li);
        });
        dropdowns = document.querySelectorAll('.dropdown');
        if (dropdowns) {
            sessionStorage.setItem('isSectionCollected', 'yes')
            dropdowns.forEach((dropdown) => {
                const select = dropdown.querySelector('.select');
                const caret = dropdown.querySelector('.caret');
                const menu = dropdown.querySelector('.menu');
                const options = dropdown.querySelectorAll('.menu li');
                const selected = dropdown.querySelector('.selected');

                select.addEventListener('click', () => {
                    select.classList.toggle('select-clicked');
                    caret.classList.toggle('caret-rotate');
                    menu.classList.toggle('menu-open');
                });

                options.forEach(option => {
                    option.addEventListener('click', () =>{
                        selected.innerText = option.innerText;
                        select.classList.remove('select-clicked')
                        caret.classList.remove('caret-rotate')
                        menu.classList.remove('menu-open')

                        options.forEach(option =>{
                            option.classList.remove('active')
                        })
                        option.classList.add('active')
                        fillTable(option.innerText);
                    })
                });
            });
        }
    }
});
            
async function fillTable(selectedSection){
    console.log(selectedSection);
    let matchingDocumentData = [];
    if(sessionStorage.getItem(selectedSection)){
        const studentsCollectionRef = collection(firestore, 'MyStudents');
        getDocs(studentsCollectionRef)
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.Section === selectedSection) {
                    const fullName = `${data["Last Name"]}, ${data["First Name"]} ${data["Middle Name"]+'.' || ''}`;
                    const documentData = {
                        id: doc.id,
                        FName: data["First Name"],
                        LName: data["Last Name"],
                        MName: data["Middle Name"],
                        gender: data["Gender"],
                        section: data["Section"],
                        fullName: fullName.trim()
                    };
                    matchingDocumentData.push(documentData);
                    sessionStorage.setItem(`${data["Section"]} - ${ data["Last Name"]}, ${ data["First Name"]}`, JSON.stringify(matchingDocumentData));
                }
            });
        })
        .catch((error) =>{

        })
        .finally(() =>{
            const tbody = document.getElementById('TBody');
            tbody.innerHTML = '';
            let counter = 1;
            matchingDocumentData.forEach((data) => {
            const newRow = document.createElement('tr');
            const numberCell = document.createElement('td');
            numberCell.textContent = counter++;
            newRow.appendChild(numberCell);

            const columns = ['fullName', 'gender', 'section'];
            
            columns.forEach((column) => {
                const cell = document.createElement('td');
                cell.textContent = data[column];
                newRow.appendChild(cell);
            });

            tbody.appendChild(newRow);
            });

        })

        sessionStorage.setItem(selectedSection, 'yes')
    }else{
        console.log('luh');
        
    }
}
// Check screen width and redirect if below 768
function checkScreenWidth() {
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (screenWidth <= 770) {
        document.getElementById('Main').style.display = 'none';
        document.getElementById('side-navbar-container').style.display = 'none';
        document.getElementById('page-404').style.display = 'block'
    }else if(screenWidth >= 770 && sessionStorage.getItem('animationShow')){

    }else if(!sessionStorage.getItem('animationShow') && screenWidth >= 770){
        if(document.querySelector('.Main')){
            document.querySelector('.Main').style.display = 'block';        
            document.querySelector('.side-navbar-container').style.display = 'flex';
            document.getElementById('page-404').style.display = 'none'
        }else{
            document.querySelector('.hidden-Main').style.display = 'none';
            document.querySelector('.hidden-side-navbar-container').style.display = 'none';
            document.getElementById('page-404').style.display = 'none'
        }
    }
    // document.body.style.maxWidth = window.innerWidth + "px";
    document.getElementById('Main').style.Width = (window.innerWidth) + "px";
}
window.onload = checkScreenWidth;
window.addEventListener("resize", checkScreenWidth);
window.addEventListener("resize", closeSidebar);

//Close Sidebar at 1000px
function closeSidebar() {
    if(sessionStorage.getItem('reloaded')){
        const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        const openButton = document.getElementById('open');
        const closeButton = document.getElementById('close');
        if(screenWidth >= 999 && openButton.classList.contains('active')){
            openButton.classList.add('active');
            closeButton.classList.remove('active');

            openButton.style.display = 'block';
            closeButton.style.display = 'none';

            var sidebarLabels = document.getElementsByClassName('sidebar-label');
            for (var i = 0; i < sidebarLabels.length; i++) {
                sidebarLabels[i].style.display = 'none';
                sidebarLabels[i].classList.add('hide');
            }
            document.getElementById('side-navbar-container').style.width = '100px';
        }else if (screenWidth <= 999 && !openButton.classList.contains('active')){
            openButton.classList.add('active');
            closeButton.classList.remove('active');

            openButton.style.display = 'none';
            closeButton.style.display = 'none';

            var sidebarLabels = document.getElementsByClassName('sidebar-label');
            for (var i = 0; i < sidebarLabels.length; i++) {
                sidebarLabels[i].style.display = 'none';
                sidebarLabels[i].classList.add('hide');
            }
            document.getElementById('side-navbar-container').style.width = '100px';
        } else if (screenWidth <= 999  && openButton.classList.contains('active')) {
            openButton.classList.add('active');
            closeButton.classList.remove('active');

            openButton.style.display = 'none';
            closeButton.style.display = 'none';

            var sidebarLabels = document.getElementsByClassName('sidebar-label');
            for (var i = 0; i < sidebarLabels.length; i++) {
                sidebarLabels[i].style.display = 'none';
                sidebarLabels[i].classList.add('hide');
            }
            document.getElementById('side-navbar-container').style.width = '100px';
        }else if (screenWidth >= 999 && openButton.classList.contains('active')){
            openButton.classList.add('active');
            closeButton.classList.remove('active');

            openButton.style.display = 'none';
            closeButton.style.display = 'block';

            var sidebarLabels = document.getElementsByClassName('sidebar-label');
            for (var i = 0; i < sidebarLabels.length; i++) {
                sidebarLabels[i].style.display = 'none';
                sidebarLabels[i].classList.add('hide');
            }
            document.getElementById('side-navbar-container').style.width = '100px';
        }else{
            openButton.classList.remove('active');
            closeButton.classList.add('active');

            openButton.style.display = 'none';
            closeButton.style.display = 'block';

            var sidebarLabels = document.getElementsByClassName('sidebar-label');
            for (var i = 0; i < sidebarLabels.length; i++) {
                sidebarLabels[i].style.display = 'block';
                sidebarLabels[i].classList.remove('hide');
            }
            document.getElementById('side-navbar-container').style.width = '250px'
        }
    }
}

//Toggle Close and Open
var openButton = document.getElementById('open');
var closeButton = document.getElementById('close');
openButton.addEventListener('click', function() {
    if((window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) >= 999){
        openButton.classList.remove('active');
        closeButton.classList.add('active');

        openButton.style.display = 'none';
        closeButton.style.display = 'block';

        var sidebarLabels = document.getElementsByClassName('sidebar-label');
        for (var i = 0; i < sidebarLabels.length; i++) {
            sidebarLabels[i].style.display = 'block';
            sidebarLabels[i].classList.remove('hide');
        }
        document.getElementById('side-navbar-container').style.width = '250px'
    }
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
    document.getElementById('side-navbar-container').style.width = '100px';
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

