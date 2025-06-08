// API Configuration
const API_BASE_URL = "http://localhost:8080/api";
const MOVIES_ENDPOINT = `${API_BASE_URL}/movies`;

// Global variables
let allMovies = [];

// DOM Elements
const nowShowingGrid = document.getElementById("now-showing-grid");
const comingSoonGrid = document.getElementById("coming-soon-grid");
const movieSelect = document.getElementById("movie-select");
const nowShowingLoading = document.getElementById("now-showing-loading");
const comingSoonLoading = document.getElementById("coming-soon-loading");
const errorModal = document.getElementById("error-modal");
const errorMessage = document.getElementById("error-message");

// Utility Functions
function showError(message) {
  errorMessage.textContent = message;
  errorModal.style.display = "block";
}

function hideLoading(element) {
  if (element) {
    element.style.display = "none";
  }
}

function formatDate(dateString) {
  if (!dateString) return "Chưa có thông tin";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN");
}

function getAgeRatingText(age) {
  if (age >= 18) return "18+";
  if (age >= 16) return "16+";
  if (age >= 13) return "13+";
  return "P";
}

// API Functions
async function fetchMovies() {
  try {
    const response = await fetch(MOVIES_ENDPOINT);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const movies = await response.json();
    allMovies = movies;
    return movies;
  } catch (error) {
    console.error("Error fetching movies:", error);
    showError("Không thể tải danh sách phim. Vui lòng thử lại sau.");
    return [];
  }
}

// Movie Card Creation
function createMovieCard(movie, isComingSoon = false) {
  const card = document.createElement("div");
  card.className = "movie-card";

  const posterUrl = movie.url_anh || "";
  const rating = movie.luotXem
    ? Math.min(Math.round(movie.luotXem / 1000), 10)
    : 0;

  card.innerHTML = `
          <div class="movie-poster">
            ${
              posterUrl
                ? `<img src="${posterUrl}" alt="${movie.tenphim}" style="width: 100%; height: 100%; object-fit: cover;">`
                : `<div class="poster-placeholder">
                <i class="fas fa-film"></i>
              </div>`
            }
            <div class="movie-overlay">
              <button class="btn-trailer" onclick="playTrailer('${
                movie.idPhim
              }')">
                <i class="fas fa-play"></i>
              </button>
            </div>
            ${
              isComingSoon && movie.ngaySanXuat
                ? `<div class="coming-date">${formatDate(
                    movie.ngaySanXuat
                  )}</div>`
                : ""
            }
          </div>
          <div class="movie-info">
            <h3>${movie.tenphim || "Chưa có tên"}</h3>
            ${
              !isComingSoon
                ? `
              <div class="movie-rating">
                <i class="fas fa-star"></i>
                <span>${rating}/10</span>
              </div>
            `
                : ""
            }
            <p class="movie-genre">
              ${movie.quocgia || "Chưa rõ"} • ${getAgeRatingText(
    movie.gioihandotuoi || 0
  )}
              ${movie.thoiLuong ? ` • ${movie.thoiLuong} phút` : ""}
            </p>
            ${
              movie.daodien
                ? `<p class="movie-director">Đạo diễn: ${movie.daodien}</p>`
                : ""
            }
            ${
              movie.moTaPhim
                ? `<p class="movie-description">${movie.moTaPhim.substring(
                    0,
                    100
                  )}...</p>`
                : ""
            }
            <button class="btn-book-movie" onclick="${
              isComingSoon
                ? `notifyMovie('${movie.idPhim}')`
                : `bookMovie('${movie.idPhim}')`
            }">
              ${isComingSoon ? "Đặt thông báo" : "Đặt vé"}
            </button>
          </div>
        `;

  return card;
}

// Movie Loading Functions
function loadNowShowingMovies(movies) {
  hideLoading(nowShowingLoading);
  nowShowingGrid.innerHTML = "";

  const nowShowingMovies = movies.filter(
    (movie) =>
      movie.trangthai && movie.trangthai.toLowerCase().includes("đang chiều")
  );

  if (nowShowingMovies.length === 0) {
    nowShowingGrid.innerHTML = `
            <div class="no-movies">
              <p>Hiện tại chưa có phim nào đang chiếu</p>
            </div>
          `;
    return;
  }

  nowShowingMovies.forEach((movie) => {
    const movieCard = createMovieCard(movie, false);
    nowShowingGrid.appendChild(movieCard);
  });
}

function loadComingSoonMovies(movies) {
  hideLoading(comingSoonLoading);
  comingSoonGrid.innerHTML = "";

  const comingSoonMovies = movies.filter(
    (movie) =>
      movie.trangthai && movie.trangthai.toLowerCase().includes("sắp chiều")
  );

  if (comingSoonMovies.length === 0) {
    comingSoonGrid.innerHTML = `
            <div class="no-movies">
              <p>Hiện tại chưa có phim nào sắp chiếu</p>
            </div>
          `;
    return;
  }

  comingSoonMovies.forEach((movie) => {
    const movieCard = createMovieCard(movie, true);
    comingSoonGrid.appendChild(movieCard);
  });
}

function loadMovieSelect(movies) {
  movieSelect.innerHTML = '<option value="">Chọn phim</option>';

  const availableMovies = movies.filter(
    (movie) =>
      movie.trangthai && movie.trangthai.toLowerCase().includes("đang chiều")
  );

  availableMovies.forEach((movie) => {
    const option = document.createElement("option");
    option.value = movie.idPhim;
    option.textContent = movie.tenphim;
    movieSelect.appendChild(option);
  });
}

// Event Handlers
function playTrailer(movieId) {
  const movie = allMovies.find((m) => m.idPhim === movieId);
  if (movie) {
    alert(`Đang phát trailer: ${movie.tenphim}`);
  }
}

function bookMovie(movieId) {
  const movie = allMovies.find((m) => m.idPhim === movieId);
  if (movie) {
    alert(`Đặt vé phim: ${movie.tenphim}`);
  }
}

function notifyMovie(movieId) {
  const movie = allMovies.find((m) => m.idPhim === movieId);
  if (movie) {
    alert(`Đã đặt thông báo cho phim: ${movie.tenphim}`);
  }
}

// Initialize App
async function initializeApp() {
  try {
    const movies = await fetchMovies();

    if (movies.length > 0) {
      loadNowShowingMovies(movies);
      loadComingSoonMovies(movies);
      loadMovieSelect(movies);

      // Update hero with featured movie
      const featuredMovie =
        movies.find((m) => m.luotXem && m.luotXem > 0) || movies[0];
      if (featuredMovie) {
        document.getElementById("hero-title").textContent =
          featuredMovie.tenphim;
        document.getElementById("hero-description").textContent =
          featuredMovie.moTaPhim || "Trải nghiệm điện ảnh tuyệt vời";
      }
    } else {
      hideLoading(nowShowingLoading);
      hideLoading(comingSoonLoading);
    }
  } catch (error) {
    console.error("Error initializing app:", error);
    hideLoading(nowShowingLoading);
    hideLoading(comingSoonLoading);
  }
}

// Error Modal Event Listeners
document.querySelector(".close").onclick = function () {
  errorModal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target === errorModal) {
    errorModal.style.display = "none";
  }
};

// Mobile Menu Toggle
document
  .querySelector(".mobile-menu-toggle")
  .addEventListener("click", function () {
    document.querySelector(".nav-menu").toggleClass("active");
  });

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initializeApp);

// Refresh data every 5 minutes
setInterval(async () => {
  const movies = await fetchMovies();
  if (movies.length > 0) {
    loadNowShowingMovies(movies);
    loadComingSoonMovies(movies);
    loadMovieSelect(movies);
  }
}, 300000);
