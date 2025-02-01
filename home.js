document.addEventListener("DOMContentLoaded", () => {
    const usernameInput = document.getElementById("username");
    const saveUsernameBtn = document.getElementById("save-username");
    const greeting = document.getElementById("greeting");
    const darkModeBtn = document.getElementById("toggle-dark-mode");
    const favoritesList = document.getElementById("favorites-list");

    const savedUsername = getCookie("username");
    if (savedUsername) {
        greeting.textContent = `Welcome back, ${savedUsername}!`;
        usernameInput.value = savedUsername;
    }

    saveUsernameBtn.addEventListener("click", () => {
        const username = usernameInput.value.trim();
        if (username) {
            setCookie("username", username, 30);
            greeting.textContent = `Welcome, ${username}!`;
        }
    });

    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("light-mode");
    }

    darkModeBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");
        localStorage.setItem("theme", document.body.classList.contains("light-mode") ? "light" : "dark");
    });

    function loadFavorites() {
        if (!favoritesList) {
            console.error("Error: favorites-list not found in index.html");
            return;
        }

        const favorites = JSON.parse(sessionStorage.getItem("favorites")) || [];
        favoritesList.innerHTML = "";

        if (favorites.length === 0) {
            favoritesList.innerHTML = "<p>No favorite movies added yet.</p>";
            return;
        }

        favorites.forEach(movie => {
            const movieElement = document.createElement("div");
            movieElement.classList.add("movie-card");
            movieElement.innerHTML = `
                <a href="details.html?id=${movie.id}">
                    <img src="${movie.poster}" alt="${movie.title}">
                </a>
                <div class="movie-title">${movie.title}</div>
                <p>⭐ ${movie.rating}</p>
            `;
            favoritesList.appendChild(movieElement);
        });
    }

    loadFavorites();
});

function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;`;
}

function getCookie(name) {
    const cookies = document.cookie.split("; ");
    for (let cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split("=");
        if (cookieName === name) return decodeURIComponent(cookieValue);
    }
    return "";
}
