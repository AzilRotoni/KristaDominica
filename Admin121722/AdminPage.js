import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js"; //App
import { doc, onSnapshot , collection, getFirestore, query, where, getDocs, setDoc, addDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-firestore.js"; //Firestore//

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

    //document.body.style.maxWidth = window.screen.width + 'px'
    closeSidebar();

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
                fillTable('')
            }
        }
        checkUserCredentials();
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
            checkScreenWidth()
        }, 3000); //3000
        }
    }

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
    showSection('dashboard'); //dashboard
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
    //Dashboard 
    //======================================================================================



    //===============================================================================================
    //STUDENTS 
    //======================================================================================

    //List of Students
    if (!sessionStorage.getItem('isSectionCollected')) {
    const ul_menu = document.getElementById('menu');
    let dropdowns;
    const studentsCollectionRef = collection(firestore, 'Sections');
    
    getDocs(studentsCollectionRef)
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const sectionData = doc.data();
                const fieldNames = Object.keys(sectionData);
                fieldNames.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
                fieldNames.forEach((fieldName) => {
                    const li = document.createElement('li');
                    let fieldValue;
                    if (Array.isArray(sectionData[fieldName]) && sectionData[fieldName].length > 0) {
                        fieldValue = `G${sectionData[fieldName][2]} - ${sectionData[fieldName][0]}`;
                    }
                    li.textContent = fieldValue;
                    li.className = 'section';
                    ul_menu.appendChild(li);
                    sessionStorage.setItem(fieldName, JSON.stringify(fieldValue));
                });
                sessionStorage.setItem('sectionData', JSON.stringify(sectionData));
            });
            dropdowns = document.querySelectorAll('.dropdown');
        })
        .catch((error) => {
            console.error('Error getting documents: ', error);
        })
        .finally(() => {
            if (dropdowns) {
                initializeDropdown();
            }
        });
    }else{
        const ul_menu = document.getElementById('menu');
        let dropdowns;
        const sectionData = JSON.parse(sessionStorage.getItem('sectionData'))

        const fieldNames = Object.keys(sectionData);
        fieldNames.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
        fieldNames.forEach((fieldName) => {
            const fieldValue = sectionData[fieldName];
            if (Array.isArray(fieldValue) && fieldValue.length > 0) {
                const li = document.createElement('li');
                li.textContent = `G${fieldValue[2]} - ${fieldValue[0]}`;
                li.className = 'section';
                ul_menu.appendChild(li);
            }
            sessionStorage.setItem(fieldName, JSON.stringify(fieldValue));
        });
        dropdowns = document.querySelectorAll('.dropdown');
        if (dropdowns) {
            initializeDropdown();
        }
    }
        document.getElementById('TBody').addEventListener('click', function (event) {
        if (event.target.tagName === 'TD' && event.target.cellIndex === 1) {
            const matchName = JSON.parse(sessionStorage.getItem('AllStudents')) || {};
            matchName.forEach((name) =>{
                const fullname = name.fullName;
                const selectedname = event.target.textContent;
                if(fullname === selectedname){
                    updateName(fullname)
                }
            });
        }
    });
});

// Check screen width and redirect if below 768
function checkScreenWidth() {
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    if (screenWidth <= 770) {
                if(document.querySelector('.Main')){
            document.querySelector('.Main').style.display = 'none';        
            document.querySelector('.side-navbar-container').style.display = 'none';
            document.getElementById('page-404').style.display = 'block'
        }else{
            document.querySelector('.svg-container').style.display = 'none';
            document.querySelector('.hidden-Main').style.display = 'none';
            document.querySelector('.hidden-side-navbar-container').style.display = 'none';
            document.getElementById('page-404').style.display = 'block'
        }
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
}

//window.onload = checkScreenWidth;
//window.addEventListener("resize", checkScreenWidth);
//window.addEventListener("resize", closeSidebar);

//Close Sidebar at 1000px
window.onload = closeSidebar;
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
//Digital Clock
const $ = (selector) =>{
    return document.querySelector(selector);
}
const hour = $('.hour')
const dot = $('.dot')
const min = $('.min')
const am = $('.am')
const pm = $('.pm')
let showDot = true;
function update(){
    showDot = !showDot;
    const now = new Date();
    let hours = now.getHours();
    const isPM = hours >= 12;
    hours = hours % 12 || 12;

    if (showDot) {
        dot.classList.add('invisible')
    }else{
        dot.classList.remove('invisible')
    }
    hour.textContent = String(hours).padStart(2, '0')
    min.textContent = String(now.getMinutes()).padStart(2, '0')
    if (isPM) {
        am.classList.remove('isam');
        pm.classList.add('ispm');
    } else {
        am.classList.add('isam');
        pm.classList.remove('ispm');
    }
}
setInterval(update, 500)
/* 
===============================================================================
            DASHBOARD
===============================================================================
*/



/* 
===============================================================================
            STUDENTS
===============================================================================
*/
async function fillTable(selectedSection){
    document.querySelector('.nameInput').removeAttribute('disabled');
    document.querySelector('.nameInput').value = ''
    let matchingDocumentData = [];
    if(!sessionStorage.getItem('isStudentsCollected')){
        sessionStorage.setItem('isStudentsCollected', 'yes')
        const studentsCollectionRef = collection(firestore, 'MyStudents');
        getDocs(studentsCollectionRef)
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const fullName = `${data["Last Name"]}, ${data["First Name"]} ${(data["Middle Name"] && data["Middle Name"][0] + '.') || ''}`;
                const documentData = {
                    id: doc.id,
                    FName: data["First Name"],
                    LName: data["Last Name"],
                    MName: data["Middle Name"],
                    
                    gradeLVL: data["Grade"],
                    section: data["Section"],
                    LRN: data["LRN"],

                    gender: data["Gender"],
                    birthdate: data["Birthday"],

                    period1: data["1st Period"],
                    period2: data["2nd Period"],
                    period3: data["3rd Period"],
                    period4: data["4th Period"],
                    fullName: fullName.trim()
                    };
                    matchingDocumentData.push(documentData);
            });
            matchingDocumentData.sort((a, b) => a.fullName.localeCompare(b.fullName));
            sessionStorage.setItem('AllStudents', JSON.stringify(matchingDocumentData));
        })
        .catch((error) =>{

        })
        .finally(() =>{
            matchingDocumentData.sort((a, b) => a.fullName.localeCompare(b.fullName));

            const tbody = document.getElementById('TBody');
            tbody.innerHTML = '';
            let counter = 1;
            matchingDocumentData.forEach((data)=>{
                if(data.section === selectedSection){
                        const newRow = document.createElement('tr');
                        const numberCell = document.createElement('td');
                        numberCell.textContent = counter++;
                        newRow.appendChild(numberCell);

                        const columns = ['fullName', 'gender', 'LRN'];
                        
                        columns.forEach((column) => {
                            const cell = document.createElement('td');
                            cell.textContent = data[column];
                            newRow.appendChild(cell);
                        });

                        tbody.appendChild(newRow);
                        createULelement(data.section)
                    }
                })
            })
    }else{
        const documentData = JSON.parse(sessionStorage.getItem('AllStudents')) || {};
        documentData.sort((a, b) => a.fullName.localeCompare(b.fullName));
        const tbody = document.getElementById('TBody');
        tbody.innerHTML = '';
        let counter = 1;
        documentData.forEach((data)=>{
            if(data.section === selectedSection){
                const newRow = document.createElement('tr');
                const numberCell = document.createElement('td');
                numberCell.textContent = counter++;
                newRow.appendChild(numberCell);
                const columns = ['fullName', 'gender', 'LRN'];
                columns.forEach((column) => {
                    const cell = document.createElement('td');
                    cell.textContent = data[column];
                    newRow.appendChild(cell);
                });
                tbody.appendChild(newRow);
                createULelement(data.section)
            }
        })
    }
}
document.addEventListener('click', (event) =>{
    const dropdowns = document.querySelectorAll('.dropdown-listOfSections .dropdown');

    dropdowns.forEach((dropdown) => {
        const select = dropdown.querySelector('.select');
        const caret = dropdown.querySelector('.caret');
        const menu = dropdown.querySelector('.menu');

        if (!dropdown.contains(event.target)) {
            // Clicked outside the dropdown
            select.classList.remove('select-clicked');
            caret.classList.remove('caret-rotate');
            menu.classList.remove('menu-open');
        }
    });
})

//Search Engine and StudentInfo
const ulElement = document.createElement('ul');
const findNamesDiv = document.querySelector('.find-names');
const nameInput = document.querySelector('.nameInput');
let currentSection;
function updateName(x) {
    const persons = JSON.parse(sessionStorage.getItem('AllStudents')) || {};
    persons.forEach((person) =>{
        if(person.fullName === x){
            document.querySelector('.Btn-container .Btn:last-child').style.display = 'block';
            document.querySelector('.studentInfo-content').style.display = 'flex'
            nameInput.value = x;
            findNamesDiv.style.display = 'none';
            document.querySelector('.text-info').textContent = `${person.FName}'s Information`;
            
            document.querySelector('.information-container .FName').value = `${person.FName}`
            document.querySelector('.information-container .MName').value = `${person.MName}`
            document.querySelector('.information-container .LName').value = `${person.LName}`
            document.querySelector('.information-container .gradeLVL').value = `${person.gradeLVL}`
            document.querySelector('.information-container .section').value = `${person.section}`
            document.querySelector('.information-container .lrn').value = `${person.LRN}`

            document.querySelector('.information-container .gender').value = `${person.gender}`
            document.querySelector('.information-container .birthdate').value = new Date(person.birthdate).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });

            document.querySelector('.grades-container .period1').value = `${person.period1}`
            document.querySelector('.grades-container .period2').value = `${person.period2}`
            document.querySelector('.grades-container .period3').value = `${person.period3}`
            document.querySelector('.grades-container .period4').value = `${person.period4}`
            const periods = [person.period1, person.period2, person.period3, person.period4];
            const validPeriods = periods.filter(period => typeof period === 'number');
            const countOfValidPeriods = validPeriods.length;
            const aveGrade = countOfValidPeriods > 0 ? validPeriods.reduce((acc, period) => acc + period, 0) / countOfValidPeriods : '';
            const formattedAveGrade = aveGrade !== '' ? (aveGrade % 1 !== 0 ? aveGrade.toFixed(3) : aveGrade.toFixed(0)) : 'N/A';
            document.querySelector('.aveGrade').textContent = formattedAveGrade;
        }
    })
}
function createULelement(section) {
    const documentData = JSON.parse(sessionStorage.getItem('AllStudents')) || {};
    findNamesDiv.innerHTML = '';
    ulElement.innerHTML = '';
    documentData.forEach(student => {
        if (student.section === section) {
            const liElement = document.createElement('li');
            liElement.textContent = student.fullName;
            liElement.addEventListener('click', function () {
                updateName(student.fullName);
            });
            ulElement.appendChild(liElement);
        }
    });

    findNamesDiv.appendChild(ulElement);
    currentSection = section;
}

nameInput.addEventListener('input', () => {
    findNamesDiv.style.display = 'flex';
    const documentData = JSON.parse(sessionStorage.getItem('AllStudents')) || {}
    let enteredValue = nameInput.value.trim().toLowerCase();

    const filteredStudents = documentData.filter(student =>
        student.section === currentSection &&
        student.fullName.toLowerCase().includes(enteredValue)
    );

    if (filteredStudents.length > 0) {
        let arr = filteredStudents.map(student => `<li>${student.fullName}</li>`).join("");
        ulElement.innerHTML = arr;

        const exactMatch = filteredStudents.find(student => student.fullName.toLowerCase() === enteredValue);
        if (exactMatch) {
            updateName(exactMatch.fullName)
        }
    } else {
        ulElement.innerHTML = '';
    }
});
ulElement.addEventListener('click', function (event) {
    const target = event.target;
    if (target.tagName === 'LI') {
        nameInput.value = target.innerText;
        const documentData = JSON.parse(sessionStorage.getItem('AllStudents')) || {}
        const matchingStudent = documentData.find(student => student.fullName === target.innerText);
        
        if (matchingStudent) {
            updateName(matchingStudent.fullName)
        }
    }
});
nameInput.addEventListener("blur", () => {
    findNamesDiv.style.display = 'none';
});
ulElement.addEventListener('mousedown', (event) => {
    event.preventDefault();
});

//Add Edit Button
const editBTN = document.getElementById('editBTN');
const addBTN = document.getElementById('addBTN')
const dropdown = document.getElementById('dropdown');
const studentBtn = document.querySelector('.studentBtn-container');
const table = document.querySelector('.table');
let isEditBTN = false;
let notif = document.querySelector('.studentBtn-container .Notification')

const editcancelBTN = document.querySelector('.studentBtn-container #cancel');
const editsaveBTN = document.querySelector('.studentBtn-container #save');
const inputData = document.querySelectorAll('.information-container input, .grades-container input')
editBTN.addEventListener('click', ()=> {
    isEditBTN = true;
    addBTN.style.display = "none"
    studentBtn.style.display = 'flex';
    dropdown.style.pointerEvents = 'none';
    nameInput.style.pointerEvents = 'none';
    table.style.pointerEvents = 'none';
    inputData.forEach(inputElement => {
        inputElement.classList.add('open');
        inputElement.removeAttribute('disabled');
    });
    const dateString = document.querySelector('.information-container #birthdate').value
    let dateParts = dateString.split('/');
    document.querySelector('.information-container #birthdate').setAttribute('type', 'date');
    document.querySelector('.information-container #birthdate').value = (`${dateParts[2]}-${dateParts[0]}-${dateParts[1]}`);
})

const studentInfo = document.querySelector('.studentInfo-content')
const textInfo = document.querySelector('.text-info')
const studentInfAadd = document.querySelector('.studentInfo-add')
const addSection = document.querySelector('.addSection-container')
const addStudent = document.querySelector('.addStudent-container')
const radioButtons = document.querySelectorAll('input[name="value-radio"]');
const formInput = document.querySelector('.InputForm')
addBTN.addEventListener('click', () => {
    notif.innerText = ''
    studentInfo.style.display = 'none'
    textInfo.innerText = ''
    studentInfAadd.style.display = 'flex'
    radioButtons[0].checked = true;
    addSection.style.display = 'flex'
    addStudent.style.display = 'none'

    addBTN.style.display = "none"
    studentBtn.style.display = 'flex';
    dropdown.style.pointerEvents = 'none';
    nameInput.style.pointerEvents = 'none';
    table.style.pointerEvents = 'none';
})
radioButtons.forEach((radio) => {
    radio.addEventListener('change', () => {
        const selectedValue = document.querySelector('input[name="value-radio"]:checked').value;
        if(selectedValue === 'value-1'){
            addSection.style.display = 'flex'
            addStudent.style.display = 'none'
        }else{
            addSection.style.display = 'none'
            addStudent.style.display = 'flex'
        }
    });
});

editcancelBTN.addEventListener('click', () =>{
    notif.innerText = ''
    if(isEditBTN){

        addBTN.style.display = "flex"
        studentBtn.style.display = 'none';
        dropdown.style.pointerEvents = 'auto';
        nameInput.style.pointerEvents = 'auto';
        table.style.pointerEvents = 'auto';
        inputData.forEach(inputElement => {
            inputElement.classList.remove('open');
            inputElement.setAttribute('disabled', '');
        });
        document.querySelector('.information-container #birthdate').removeAttribute('type');
        updateName(nameInput.value);
        isEditBTN = false
    }else if(!isEditBTN){
        studentInfAadd.style.display = 'none'
        radioButtons[0].checked = true;

        //Add Section
        document.querySelector('.InputForm #gradeLVL').value = ''
        document.querySelector('.InputForm #section').value = ''
        document.querySelector('.InputForm #adviser').value = ''

        //Add Student
        document.querySelector('.InputForm #newFName').value = ''
        document.querySelector('.InputForm #newMName').value = ''
        document.querySelector('.InputForm #newLName').value = ''
        document.querySelector('.InputForm #newGender').value = ''
        document.querySelector('.InputForm #newLRN').value = ''
        document.querySelector('.InputForm #newGradeLVL').value = ''
        document.querySelector('.InputForm #newSection').value = ''

        addBTN.style.display = "flex"
        addStudent.style.display = 'none'
        studentBtn.style.display = 'none';
        dropdown.style.pointerEvents = 'auto';
        nameInput.style.pointerEvents = 'auto';
        table.style.pointerEvents = 'auto';
        inputData.forEach(inputElement => {
            inputElement.classList.remove('open');
            inputElement.setAttribute('disabled', '');
        });
        updateName(nameInput.value);
    }

})
editsaveBTN.addEventListener('click', async () =>{
    notif.innerText = ''
    if(isEditBTN){
        addBTN.style.display = "flex"
        studentBtn.style.display = 'none';
        dropdown.style.pointerEvents = 'auto';
        nameInput.style.pointerEvents = 'auto';
        table.style.pointerEvents = 'auto';
        inputData.forEach(inputElement => {
            inputElement.classList.remove('open');
            inputElement.setAttribute('disabled', '');
        });
        document.querySelector('.information-container #birthdate').removeAttribute('type');

        const students = JSON.parse(sessionStorage.getItem('AllStudents')) || {}
        students.forEach(async (student) =>{
            if(nameInput.value === student.fullName){
                const lastName = document.querySelector('.information-container .LName').value;
                const firstName = document.querySelector('.information-container .FName').value;
                const middleName = document.querySelector('.information-container .MName').value;
                const fullName = `${lastName}, ${firstName} ${((middleName && middleName[0]) + '.') || ''}`;

                const firestoreFieldMapping = {
                    FName: 'First Name',
                    LName: 'Last Name',
                    MName: 'Middle Name',
                    
                    gradeLVL: 'Grade',
                    section: 'Section',
                    LRN: 'LRN',

                    gender: 'Gender',
                    birthdate: 'Birthday',

                    period1: '1st Period',
                    period2: '2nd Period',
                    period3: '3rd Period',
                    period4: '4th Period',
                };

                const documentData = {
                    id: student.id,
                    FName: document.querySelector('.information-container .FName').value,
                    LName: document.querySelector('.information-container .LName').value,
                    MName: document.querySelector('.information-container .MName').value,
                    
                    gradeLVL: parseInt(document.querySelector('.information-container .gradeLVL').value),
                    section: document.querySelector('.information-container .section').value,
                    LRN: document.querySelector('.information-container .lrn').value,

                    gender: document.querySelector('.information-container .gender').value,
                    birthdate: new Date(document.querySelector('.information-container #birthdate').value).toDateString(),

                    period1: parseInt(document.querySelector('.grades-container .period1').value),
                    period2: parseInt(document.querySelector('.grades-container .period2').value),
                    period3: parseInt(document.querySelector('.grades-container .period3').value),
                    period4: parseInt(document.querySelector('.grades-container .period4').value),
                    fullName: fullName.trim(),
                };

                const updatedFields = {};
                Object.keys(firestoreFieldMapping).forEach((documentDataField) => {
                    updatedFields[firestoreFieldMapping[documentDataField]] = documentData[documentDataField];
                });

                sessionStorage.removeItem(`${student.section} - ${student.LName}, ${student.FName}`);
                sessionStorage.setItem(`${documentData.section} - ${documentData.LName}, ${documentData.FName}`, JSON.stringify(documentData));

                const existingData = JSON.parse(sessionStorage.getItem('AllStudents')) || {}
                const updatedSessionStorageData = existingData.map((data) => (data.id === documentData.id ? documentData : data));
                sessionStorage.setItem('AllStudents', JSON.stringify(updatedSessionStorageData));

                const studentDocRef = doc(firestore, 'MyStudents', documentData.id);
                try {
                   await setDoc(studentDocRef, updatedFields, { merge: true });
                } catch (error) {
                }

                fillTable(documentData.section);
                updateName(documentData.fullName);
                document.querySelector('.dropdown .selected').textContent = documentData.section
            }
        })
        isEditBTN = false
    }else if(!isEditBTN){
        if(radioButtons[0].checked === true && document.querySelector('.InputForm #section').value !== ''
                                            && document.querySelector('.InputForm #adviser').value !== '' 
                                            &&document.querySelector('.InputForm #gradeLVL').value !== ''){
            const sectionData = JSON.parse(sessionStorage.getItem('sectionData'))
            const Section = document.querySelector('.InputForm #section').value

            const existingDocumentKey = Object.keys(sectionData).find(key =>
                sectionData[key][0] === Section
            );

            if (existingDocumentKey){
                document.querySelector('.studentBtn-container .Notification').innerText = `${Section} is already Exists`
            }else{
                const documentRef = doc(firestore, 'Sections', '7NBxz8gZyZWz9QgwsYOL');
                const documentData = {
                    [Section]: [
                        document.querySelector('.InputForm #section').value,
                        document.querySelector('.InputForm #adviser').value,
                        document.querySelector('.InputForm #gradeLVL').value
                    ],
                };
                setDoc(documentRef, documentData, { merge: true });

                document.querySelector('.dropdown .selected').textContent = Section
                const sectionData = JSON.parse(sessionStorage.getItem('sectionData'))
                sectionData[Section] = [
                    document.querySelector('.InputForm #section').value,
                    document.querySelector('.InputForm #adviser').value,
                    document.querySelector('.InputForm #gradeLVL').value
                ]
                sessionStorage.setItem('sectionData', JSON.stringify(sectionData));

                document.querySelector('.dropdown .selected').textContent = `G${document.querySelector('.InputForm #gradeLVL').value} - ${Section}`
                const ul_menu = document.getElementById('menu');
                ul_menu.innerHTML = ''
                const fieldNames = Object.keys(sectionData);
                fieldNames.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
                fieldNames.forEach((fieldName) => {
                    const fieldValue = sectionData[fieldName];
                    if (Array.isArray(fieldValue) && fieldValue.length > 0) {
                        const li = document.createElement('li');
                        li.textContent = `G${fieldValue[2]} - ${fieldValue[0]}`;
                        li.className = 'section';
                        ul_menu.appendChild(li);
                    }
                    sessionStorage.setItem(fieldName, JSON.stringify(fieldValue));
                });
                initializeDropdown();
                dropdown.querySelector('.select').removeEventListener('click', toggleDropdown);
                dropdown.querySelector('.select').addEventListener('click', toggleDropdown);

                fillTable(Section)
                document.querySelector('.InputForm #gradeLVL').value = ''
                document.querySelector('.InputForm #section').value = ''
                document.querySelector('.InputForm #adviser').value = ''

                document.querySelector('.InputForm #newFName').value = ''
                document.querySelector('.InputForm #newMName').value = ''
                document.querySelector('.InputForm #newLName').value = ''
                document.querySelector('.InputForm #newGender').value = ''
                document.querySelector('.InputForm #newLRN').value = ''
                document.querySelector('.InputForm #newGradeLVL').value = ''
                document.querySelector('.InputForm #newSection').value = ''

                addBTN.style.display = "flex"
                studentBtn.style.display = 'none';
                dropdown.style.pointerEvents = 'auto';
                nameInput.style.pointerEvents = 'auto';
                table.style.pointerEvents = 'auto';

                studentInfAadd.style.display = 'none'
            }
        }else if(radioButtons[1].checked === true && document.querySelector('.InputForm #newFName').value !== ''
                                            &&document.querySelector('.InputForm #newLName').value !== ''
                                            &&document.querySelector('.InputForm #newGender').value !== ''
                                            &&document.querySelector('.InputForm #newLRN').value !== ''
                                            &&document.querySelector('.InputForm #newGradeLVL').value !== ''
                                            &&document.querySelector('.InputForm #newSection').value !== ''){
            const documentRef = collection(firestore, 'MyStudents');
            addDoc(documentRef , {
                'First Name' : document.querySelector('.InputForm #newFName').value,
                'Middle Name' : document.querySelector('.InputForm #newMName').value,
                'Last Name' : document.querySelector('.InputForm #newLName').value,

                'Grade' : parseInt(document.querySelector('.InputForm #newGradeLVL').value),
                'Section' : document.querySelector('.InputForm #newSection').value,
                'LRN' : document.querySelector('.InputForm #newLRN').value,

                'Gender' : document.querySelector('.InputForm #newGender').value,
                'Birthday': new Date(document.querySelector('.InputForm #newBirthDate').value).toDateString(),

                '1st Period' : NaN,
                '2nd Period' : NaN,
                '3rd Period' : NaN,
                '4th Period' : NaN,
            });
            addBTN.style.display = "flex"
            studentBtn.style.display = 'none';
            dropdown.style.pointerEvents = 'auto';
            nameInput.style.pointerEvents = 'auto';
            table.style.pointerEvents = 'auto';
            const docId = documentRef.id;

            const sec = document.querySelector('.InputForm #newSection').value;
            document.querySelector('.dropdown .selected').textContent = sec

            const AllStudents = JSON.parse(sessionStorage.getItem('AllStudents')) || {}
            const fullName = `${document.querySelector('.InputForm #newLName').value}, ${document.querySelector('.InputForm #newFName').value} ${(document.querySelector('.InputForm #newMName').value && (document.querySelector('.InputForm #newMName').value)[0] + '.') || ''}`;
            const documentData = {
                id: docId,
                FName: document.querySelector('.InputForm #newFName').value,
                LName: document.querySelector('.InputForm #newLName').value,
                MName: document.querySelector('.InputForm #newMName').value,

                gradeLVL: parseInt(document.querySelector('.InputForm #newGradeLVL').value),
                section: document.querySelector('.InputForm #newSection').value,
                LRN: document.querySelector('.InputForm #newLRN').value,

                gender: document.querySelector('.InputForm #newGender').value,
                birthdate: new Date(document.querySelector('.InputForm #newBirthDate').value).toDateString(),

                period1: NaN,
                period2: NaN,
                period3: NaN,
                period4: NaN,
                fullName: fullName.trim()
            };
            AllStudents.push(documentData);
            sessionStorage.setItem('AllStudents', JSON.stringify(AllStudents));
            fillTable(sec)

            document.querySelector('.InputForm #gradeLVL').value = ''
            document.querySelector('.InputForm #section').value = ''
            document.querySelector('.InputForm #adviser').value = ''

            document.querySelector('.InputForm #newFName').value = ''
            document.querySelector('.InputForm #newMName').value = ''
            document.querySelector('.InputForm #newLName').value = ''
            document.querySelector('.InputForm #newGender').value = ''
            document.querySelector('.InputForm #newBirthDate').value = ''
            document.querySelector('.InputForm #newLRN').value = ''
            document.querySelector('.InputForm #newBirthDate').value = ''
            document.querySelector('.InputForm #newGradeLVL').value = ''
            document.querySelector('.InputForm #newSection').value = ''

            addBTN.style.display = "flex"
            studentBtn.style.display = 'none';
            dropdown.style.pointerEvents = 'auto';
            nameInput.style.pointerEvents = 'auto';
            table.style.pointerEvents = 'auto';
            addStudent.style.display = 'none'

            studentInfAadd.style.display = 'none'
        }
    }
})

function initializeDropdown(){
    let dropdowns = document.querySelectorAll('.dropdown');

    findNamesDiv.style.display = 'none';
    sessionStorage.setItem('isSectionCollected', 'yes')
    dropdowns.forEach((dropdown) => {
        const select = dropdown.querySelector('.select');
        const caret = dropdown.querySelector('.caret');
        const menu = dropdown.querySelector('.menu');
        const options = dropdown.querySelectorAll('.menu li');
        const selected = dropdown.querySelector('.selected');
        
        const sortedOptions = Array.from(options).sort((a, b) => a.innerText.localeCompare(b.innerText));
        menu.innerHTML = ''
        sortedOptions.forEach((option) => {
            menu.appendChild(option);
        });

        select.addEventListener('click', () => {
            select.classList.toggle('select-clicked');  
            caret.classList.toggle('caret-rotate');
            menu.classList.toggle('menu-open');
        });
        
        options.forEach(option => {
            option.addEventListener('click', (event) =>{
                selected.innerText = option.innerText;
                select.classList.remove('select-clicked')
                caret.classList.remove('caret-rotate')
                menu.classList.remove('menu-open')
                document.querySelector('.text-info').textContent =''
                document.querySelector('.Btn-container .Btn:last-child').style.display = 'none';
                document.querySelector('.studentInfo-content').style.display = 'none'

                options.forEach(option =>{
                    option.classList.remove('active')
                })
                option.classList.add('active')
                let section
                const match = option.innerText.match(/G\d+\s*-\s*(.+)/);
                if (match && match[1]) {
                    section = match[1].trim();
                }
                fillTable(section);
            })
        });
    });
}
function toggleDropdown() {
    const select = document.querySelector('.dropdown .select');
    const caret = document.querySelector('.dropdown .caret');
    const menu = document.querySelector('.dropdown .menu');
    
    select.classList.toggle('select-clicked');
    caret.classList.toggle('caret-rotate');
    menu.classList.toggle('menu-open');
}

const gradeLVL_dropdown = document.getElementById('gradeLVL');
const gradeList = document.getElementById('gradeList');
gradeLVL_dropdown.addEventListener('focus', () => {
  gradeList.style.display = 'flex';
});
gradeLVL_dropdown.addEventListener('blur', () => {
    setTimeout(() => {
        gradeList.style.display = 'none';
    }, 200);
});
gradeList.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    gradeLVL_dropdown.value = event.target.innerText;
    gradeList.style.display = 'none';
  }
});

const newGrade = document.getElementById('newGradeLVL');
const newGradeList = document.getElementById('newGradeList');
newGrade.addEventListener('focus', () => {
  newGradeList.style.display = 'flex';
});
newGrade.addEventListener('blur', () => {
    setTimeout(() => {
        newGradeList.style.display = 'none';
    }, 200);
});
newGradeList.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    newGrade.value = event.target.innerText;
    newGradeList.style.display = 'none';
  }
});
const newGender = document.getElementById('newGender');
const genderList = document.getElementById('genderList');
newGender.addEventListener('focus', () => {
  genderList.style.display = 'flex';
});
newGender.addEventListener('blur', () => {
    setTimeout(() => {
        genderList.style.display = 'none';
    }, 200);
});
genderList.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    newGender.value = event.target.innerText;
    genderList.style.display = 'none';
  }
});

const section = document.querySelector('.InputForm #newSection');
const sectionListElement = document.getElementById('SectionList');
section.addEventListener('focus', () =>{
    sectionListElement.style.display = 'flex';

    sectionListElement.innerHTML = ''
    const sectionData = JSON.parse(sessionStorage.getItem('sectionData'))

    const fieldNames = Object.keys(sectionData);
    fieldNames.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    fieldNames.forEach((fieldName) => {
        const fieldValue = sectionData[fieldName];
        if (Array.isArray(fieldValue) && fieldValue.length > 0) {
            const li = document.createElement('li');
            li.textContent = `${fieldValue[0]}`;
            sectionListElement.appendChild(li);
        }
    });
})
section.addEventListener('blur', () => {
    setTimeout(() => {
        sectionListElement.style.display = 'none';
    }, 200);
});
sectionListElement.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    section.value = event.target.innerText;
    sectionListElement.style.display = 'none';
  }
});
document.querySelectorAll('.information-container #birthdate, .addNewStudent-info .InputForm #newBirthDate').forEach(input => {
  input.addEventListener('blur', (event) => {
    let inputValue = parseInt(event.target.value);
        if (!isNaN(inputValue)) {
            let adjustedYear = parseInt(inputValue);
            if (adjustedYear >= 0 && adjustedYear <= 99) {
                adjustedYear += (adjustedYear < 50) ? 2000 : 1900;

                let existingDate = event.target.valueAsDate;
                let day = existingDate.getDate() +2;
                let month = existingDate.getMonth() + 1;
                let adjustedDate = new Date(`${adjustedYear}-${month}-${day}`);

                adjustedDate.setFullYear(adjustedYear);
                event.target.valueAsDate = adjustedDate;
            }
        }
     })
});
