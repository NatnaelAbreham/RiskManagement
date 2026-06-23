const sidebar = document.querySelector(".sidebar");
const mainContent = document.querySelector(".main-content");
const topbar = document.querySelector(".topbar");
const toggleBtn = document.getElementById("toggleSidebar");

toggleBtn.addEventListener("click", () => {

    // Desktop toggle
    sidebar.classList.toggle("hide");
    mainContent.classList.toggle("full");
    topbar.classList.toggle("full");

    // Mobile toggle
    sidebar.classList.toggle("show");
});