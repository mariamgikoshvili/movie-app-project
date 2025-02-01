document.addEventListener("DOMContentLoaded", async () => {
    const movieId = new URLSearchParams(window.location.search).get("id");
    if (!movieId) return;

    const movieDetails = document.getElementById("movie-details");

    try {
        const API_KEY = "3fbe7fb508512c345b5d9d33a4f76732";
        const BASE_URL = "https://api.themoviedb.org/3";
        const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
        const movie = await response.json();

        if (!movieDetails) {
            console.error("Error: movie-details container not found!");
            return;
        }

        movieDetails.innerHTML = `
            <h2>${movie.title}</h2>
            <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'images/no-image.jpg'}" 
                 alt="${movie.title}">
            <p><strong>Release Date:</strong> ${movie.release_date}</p>
            <p><strong>Rating:</strong> ⭐ ${movie.vote_average}</p>
            <p><strong>Overview:</strong> ${movie.overview}</p>
            <button id="favorite-btn">${isMovieFavorite(movie.id) ? "❤️ Remove Favorite" : "🤍 Add Favorite"}</button>
            <a href="list.html">🔙 Back to Movies</a>
        `;

        const favoriteBtn = document.getElementById("favorite-btn");
        favoriteBtn.addEventListener("click", () => {
            toggleFavorite(movie);
            favoriteBtn.textContent = isMovieFavorite(movie.id) ? "❤️ Remove Favorite" : "🤍 Add Favorite";
        });

    } catch (error) {
        console.error("Error fetching movie details:", error);
        movieDetails.innerHTML = "<p>Failed to load movie details.</p>";
    }
});

function isMovieFavorite(movieId) {
    const favorites = JSON.parse(sessionStorage.getItem("favorites")) || [];
    return favorites.some(fav => fav.id === movieId);
}

function toggleFavorite(movie) {
    let favorites = JSON.parse(sessionStorage.getItem("favorites")) || [];
    const exists = favorites.some(fav => fav.id === movie.id);

    if (exists) {
        favorites = favorites.filter(fav => fav.id !== movie.id);
    } else {
        favorites.push({
            id: movie.id,
            title: movie.title,
            poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'images/no-image.jpg',
            rating: movie.vote_average
        });
    }

    sessionStorage.setItem("favorites", JSON.stringify(favorites));
}
