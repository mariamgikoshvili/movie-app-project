document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("theme") === "light") {
        document.body.classList.add("light-mode");
    }

    const darkModeBtn = document.getElementById("dark-mode-toggle");
    if (darkModeBtn) {
        darkModeBtn.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
        });
    }
});