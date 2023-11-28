/*
===========================================================================================================
    EVENT-DRIVEN
===========================================================================================================
*/

// Load the Animated SVG
document.addEventListener('DOMContentLoaded', function (e) {
    e.preventDefault

    let fname = localStorage.getItem('FirstName')
    let lname = localStorage.getItem('LastName')
    let role = localStorage.getItem('Role')
    document.getElementById('open').style.display = 'none';
    document.getElementById('close').style.display = 'block';

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
        sessionStorage.setItem('animationShown', 'true');
    }
    function showAdminPage(fname, lname, role) {
        let svgContainer = document.getElementById('svg-container');
        if(svgContainer){
            document.body.classList.remove('show-admin-page');
            document.getElementById('open').style.display = 'none';
            document.getElementById('close').style.display = 'block';
            document.getElementById('greet').textContent = `Hello ${role} ${fname} ${lname} !!`;

        setTimeout(function () {
            svgContainer.id = 'svg-container-hidden';
            document.body.classList.add('show-admin-page');
            
        }, 2500);
        }
    }
});

// Check screen width and redirect if below 768
function checkScreenWidth() {
    var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (screenWidth <= 768) {
        localStorage.setItem('currentURL', window.location.href)
        window.location.href = "../Admin121722/404/Admin404Page.html";
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