const API_KEY = "3fbe7fb508512c345b5d9d33a4f76732"; 
const BASE_URL = "https://api.themoviedb.org/3";

let currentPage = 1;
let totalPages = 1;

document.addEventListener('DOMContentLoaded', () => {
    async function getMovies(query = "") {
        try {
            const url = query
                ? `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${currentPage}`
                : `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${currentPage}`;

            const response = await fetch(url);
            const data = await response.json();

            totalPages = data.total_pages;

            const moviesList = document.getElementById("movies-list");
            if (!moviesList) {
                console.error("movies-list container not found!");
                return;
            }

            moviesList.innerHTML = "";

            if (!data.results || data.results.length === 0) {
                moviesList.innerHTML = "<p>No movies found.</p>";
                return;
            }

            data.results.forEach(movie => {
                const movieElement = document.createElement("div");
                movieElement.classList.add("movie-card");
                movieElement.innerHTML = `
                    <a href="details.html?id=${movie.id}">
                        <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'images/no-image.jpg'}" 
                            alt="${movie.title}">
                    </a>
                    <div class="movie-title">${movie.title}</div>
                    <p>⭐ ${movie.vote_average}</p>
                `;
                moviesList.appendChild(movieElement);
            });

            updatePaginationButtons();
        } catch (error) {
            console.error("Error fetching movies:", error);
        }
    }

    function updatePaginationButtons() {
        const prevButton = document.getElementById("prev-button");
        const nextButton = document.getElementById("next-button");

        if (prevButton && nextButton) {
            prevButton.disabled = currentPage === 1;
            nextButton.disabled = currentPage === totalPages;
        }
    }

    document.getElementById("prev-button")?.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            getMovies();
            window.scrollTo(0, 0);
        }
    });

    document.getElementById("next-button")?.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            getMovies();
            window.scrollTo(0, 0);
        }
    });

    const searchButton = document.getElementById("search-button");
    const searchBar = document.getElementById("search-bar");

    if (searchButton && searchBar) {
        searchButton.addEventListener("click", () => {
            const query = searchBar.value.trim();
            if (query) {
                currentPage = 1;
                getMovies(query);
            } else {
                getMovies();
            }
        });
    }

    async function getMovieDetails() {
        const movieId = new URLSearchParams(window.location.search).get("id");
        if (!movieId) {
            console.error("Movie ID is missing in the URL");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`);
            const movie = await response.json();

            const movieDetails = document.getElementById("movie-details");
            if (!movieDetails) {
                console.error("movie-details container not found!");
                return;
            }

            movieDetails.innerHTML = `
                <h2>${movie.title}</h2>
                <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'images/no-image.jpg'}" 
                     alt="${movie.title}">
                <p><strong>Release Date:</strong> ${movie.release_date}</p>
                <p><strong>Rating:</strong> ⭐ ${movie.vote_average}</p>
                <p><strong>Overview:</strong> ${movie.overview}</p>
                <p><strong>Genres:</strong> ${movie.genres.map(genre => genre.name).join(", ")}</p>
                <a href="list.html">🔙 Back to Movies</a>
            `;
        } catch (error) {
            console.error("Error fetching movie details:", error);
        }
    }

    if (window.location.pathname.includes("details.html")) {
        getMovieDetails();
    } else {
        getMovies();
    }
});
