// Check screen width and redirect if below 1204px
function checkScreenWidth() {
    var screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    if (screenWidth > 768) {
        window.location.href = localStorage.getItem('currentURL');
    }
}
window.onload = checkScreenWidth;
window.addEventListener("resize", checkScreenWidth);