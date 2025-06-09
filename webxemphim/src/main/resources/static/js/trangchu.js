// API Configuration
const API_BASE_URL = "http://localhost:8080/api";
const MOVIES_ENDPOINT = `${API_BASE_URL}/movies`;

// Global variables
let allMovies = [];

// DOM Elements
const nowShowingGrid = document.getElementById("now-showing-grid");
const comingSoonGrid = document.getElementById("coming-soon-grid");
const movieSelect = document.getElementById("movie-select");
const cinemaSelect = document.getElementById("cinema-select");
const dateSelect = document.getElementById("date-select");
const showtimeSelect = document.getElementById("showtime-select");
const bookButton = document.getElementById("btn-book");
const nowShowingLoading = document.getElementById("now-showing-loading");
const comingSoonLoading = document.getElementById("coming-soon-loading");
const errorModal = document.getElementById("error-modal");
const errorMessage = document.getElementById("error-message");
const heroBg = document.getElementById("hero-bg");

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

// Set minimum date to today
function setMinDate() {
  const today = new Date().toISOString().split("T")[0];
  dateSelect.min = today;
  dateSelect.value = today;
}

// Navigation Functions
function goToMovieDetail(movieId) {
  // Store movie data in sessionStorage for the detail page
  const movie = allMovies.find((m) => m.idPhim === movieId);
  if (movie) {
    // Chỉ truyền ID
    sessionStorage.setItem("selectedMovieId", movieId);
    // Hoặc qua URL parameter
    window.location.href = `/html/chitietphim.html?id=${movieId}`;
  }
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
  // Add click event to entire card for navigation
  card.style.cursor = "pointer";
  card.addEventListener("click", (e) => {
    // Prevent navigation if clicking on buttons
    if (!e.target.closest("button")) {
      goToMovieDetail(movie.idPhim);
    }
  });

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
              ${movie.quocgia || "Chưa rõ"} • ${movie.gioihandotuoi || 0}
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
            <div class="movie-actions">
              
              <button class="btn-book-movie" onclick="${
                isComingSoon
                  ? `notifyMovie('${movie.idPhim}')`
                  : `bookMovie('${movie.idPhim}')`
              }">
                ${isComingSoon ? "Đặt thông báo" : "Đặt vé"}
              </button>
            </div>
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
      movie.trangthai && movie.trangthai.toLowerCase().includes("đang chiếu")
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
      movie.trangthai && movie.trangthai.toLowerCase().includes("sắp chiếu")
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
      movie.trangthai && movie.trangthai.toLowerCase().includes("đang chiếu")
  );

  availableMovies.forEach((movie) => {
    const option = document.createElement("option");
    option.value = movie.idPhim;
    option.textContent = movie.tenphim;
    movieSelect.appendChild(option);
  });
}

// Booking form functions
function loadCinemas(movieId) {
  cinemaSelect.innerHTML = '<option value="">Chọn rạp</option>';
  cinemaSelect.disabled = false;

  // Mock cinema data - replace with actual API call
  const cinemas = [
    { id: 1, name: "Galaxy Nguyễn Du" },
    { id: 2, name: "Galaxy Đà Nẵng" },
    { id: 3, name: "Galaxy Kinh Dương Vương" },
  ];

  cinemas.forEach((cinema) => {
    const option = document.createElement("option");
    option.value = cinema.id;
    option.textContent = cinema.name;
    cinemaSelect.appendChild(option);
  });
}

function loadShowtimes(movieId, cinemaId, date) {
  showtimeSelect.innerHTML = '<option value="">Chọn suất</option>';
  showtimeSelect.disabled = false;

  // Mock showtime data - replace with actual API call
  const showtimes = ["10:00", "13:00", "16:00", "19:00", "22:00"];

  showtimes.forEach((time) => {
    const option = document.createElement("option");
    option.value = time;
    option.textContent = time;
    showtimeSelect.appendChild(option);
  });
}

function updateHeroBackground(movie) {
  if (movie && movie.url_anh) {
    heroBg.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${movie.url_anh})`;
    heroBg.style.backgroundSize = "cover";
    heroBg.style.backgroundPosition = "center";
    heroBg.style.backgroundRepeat = "no-repeat";
  }
}

// Event Handlers
function playTrailer(movieId) {
  event.stopPropagation(); // Prevent card click event
  const movie = allMovies.find((m) => m.idPhim === movieId);
  if (movie) {
    if (movie.trailer_url) {
      // If trailer URL exists, open it
      window.open(movie.trailer_url, "_blank");
    } else {
      // Fallback message
      alert(`Đang phát trailer: ${movie.tenphim}`);
    }
  }
}

function bookMovie(movieId) {
  event.stopPropagation(); // Prevent card click event
  const movie = allMovies.find((m) => m.idPhim === movieId);
  if (movie) {
    // Set the movie in the booking form
    movieSelect.value = movieId;
    movieSelect.dispatchEvent(new Event("change"));

    // Scroll to booking form
    document
      .querySelector(".quick-booking")
      .scrollIntoView({ behavior: "smooth" });
  }
}

function notifyMovie(movieId) {
  event.stopPropagation(); // Prevent card click event
  const movie = allMovies.find((m) => m.idPhim === movieId);
  if (movie) {
    alert(`Đã đặt thông báo cho phim: ${movie.tenphim}`);
  }
}

// Form validation and enable/disable logic
function validateBookingForm() {
  const movieSelected = movieSelect.value !== "";
  const cinemaSelected = cinemaSelect.value !== "";
  const dateSelected = dateSelect.value !== "";
  const showtimeSelected = showtimeSelect.value !== "";

  bookButton.disabled = !(
    movieSelected &&
    cinemaSelected &&
    dateSelected &&
    showtimeSelected
  );
}

// Event Listeners for booking form
movieSelect.addEventListener("change", function () {
  const selectedMovieId = this.value;

  if (selectedMovieId) {
    loadCinemas(selectedMovieId);
    dateSelect.disabled = false;
  } else {
    // Reset and disable other fields
    cinemaSelect.innerHTML =
      '<option value="">Vui lòng chọn phim trước</option>';
    cinemaSelect.disabled = true;
    dateSelect.disabled = true;
    dateSelect.value = "";
    showtimeSelect.innerHTML =
      '<option value="">Vui lòng chọn ngày trước</option>';
    showtimeSelect.disabled = true;
  }

  validateBookingForm();
});

cinemaSelect.addEventListener("change", function () {
  const selectedMovieId = movieSelect.value;
  const selectedCinemaId = this.value;
  const selectedDate = dateSelect.value;

  if (selectedMovieId && selectedCinemaId && selectedDate) {
    loadShowtimes(selectedMovieId, selectedCinemaId, selectedDate);
  }

  validateBookingForm();
});

dateSelect.addEventListener("change", function () {
  const selectedMovieId = movieSelect.value;
  const selectedCinemaId = cinemaSelect.value;
  const selectedDate = this.value;

  if (selectedMovieId && selectedCinemaId && selectedDate) {
    loadShowtimes(selectedMovieId, selectedCinemaId, selectedDate);
  } else {
    showtimeSelect.innerHTML =
      '<option value="">Vui lòng chọn ngày trước</option>';
    showtimeSelect.disabled = true;
  }

  validateBookingForm();
});

showtimeSelect.addEventListener("change", function () {
  validateBookingForm();
});

bookButton.addEventListener("click", function () {
  const selectedMovie = allMovies.find((m) => m.idPhim === movieSelect.value);
  const selectedCinema = cinemaSelect.options[cinemaSelect.selectedIndex].text;
  const selectedDate = dateSelect.value;
  const selectedShowtime = showtimeSelect.value;

  if (selectedMovie) {
    // Store booking info and redirect to booking page
    const bookingInfo = {
      movie: selectedMovie,
      cinema: selectedCinema,
      date: selectedDate,
      showtime: selectedShowtime,
    };
    sessionStorage.setItem("bookingInfo", JSON.stringify(bookingInfo));

    // Redirect to booking page or show success message
    alert(
      `Đặt vé thành công!\nPhim: ${selectedMovie.tenphim}\nRạp: ${selectedCinema}\nNgày: ${selectedDate}\nSuất: ${selectedShowtime}`
    );

    // Uncomment the line below if you have a booking page
    // window.location.href = '/html/datve.html';
  }
});

// Initialize App
async function initializeApp() {
  try {
    setMinDate();
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
        updateHeroBackground(featuredMovie);
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
    const navMenu = document.querySelector(".nav-menu");
    navMenu.classList.toggle("active");
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

document.addEventListener("DOMContentLoaded", () => {
  const login_button = document.querySelector(".btn-login");
  const register_button = document.querySelector(".btn-register");
  if (login_button) {
    login_button.addEventListener("click", () => {
      window.location.href = "/html/dangnhap.html";
    });
  }
  if (register_button) {
    register_button.addEventListener("click", () => {
      window.location.href = "/html/dangnhap.html";
    });
  }
});
