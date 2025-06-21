// API Configuration
const API_BASE_URL = "http://localhost:8080/api";
const MOVIES_ENDPOINT = `${API_BASE_URL}/movies`;
const SCHEDULE_ENDPOINT = `${API_BASE_URL}/schedule/date`;
const SHOWTIME_ENDPOINT = `${API_BASE_URL}/showtime`;

// Global variables
let allMovies = [];
let availableDates = [];
let availableShowtimes = [];

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

// Modal Functions
function showModal(modalId, message) {
  const modal = document.getElementById(modalId);
  const messageElement = modal.querySelector(".modal-body p");
  messageElement.textContent = message;
  modal.style.display = "block";
}
function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}
// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
});

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

// Format date for display (no longer need setMinDate since we're using select)
function formatDateForDisplay(dateString) {
  if (!dateString) return "Chưa có thông tin";
  const date = new Date(dateString);
  const options = {
    weekday: "short",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return date.toLocaleDateString("vi-VN", options);
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
    const apiResponse = await response.json();

    // Kiểm tra cấu trúc API response
    if (apiResponse.code === 1000 && apiResponse.result) {
      allMovies = apiResponse.result;
      return apiResponse.result;
    } else {
      // Nếu API trả về lỗi
      throw new Error(apiResponse.message || "API trả về lỗi không xác định");
    }
  } catch (error) {
    console.error("Error fetching movies:", error);
    showModal(
      "errorModal",
      "Không thể tải danh sách phim. Vui lòng thử lại sau."
    );
    return [];
  }
}

async function fetchScheduleDates(movieId) {
  try {
    const response = await fetch(`${SCHEDULE_ENDPOINT}/${movieId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const apiResponse = await response.json();

    if (apiResponse.code === 1000 && apiResponse.result) {
      return apiResponse.result; // Trả về mảng dates
    } else {
      throw new Error(apiResponse.message || "Không thể lấy ngày chiếu");
    }
  } catch (error) {
    console.error("Error fetching schedule dates:", error);
    showModal("errorModal", "Không thể tải ngày chiếu. Vui lòng thử lại sau.");
    return [];
  }
}

async function fetchShowtimes(movieId, date) {
  try {
    const response = await fetch(`${SHOWTIME_ENDPOINT}/${movieId}/${date}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const apiResponse = await response.json();

    if (apiResponse.code === 1000 && apiResponse.result) {
      return apiResponse.result; // Trả về mảng showtimes
    } else {
      throw new Error(apiResponse.message || "Không thể lấy suất chiếu");
    }
  } catch (error) {
    console.error("Error fetching showtimes:", error);
    showModal("errorModal", "Không thể tải suất chiếu. Vui lòng thử lại sau.");
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

// Updated Booking form functions using real APIs
async function loadDates(movieId) {
  dateSelect.innerHTML = '<option value="">Đang tải ngày chiếu...</option>';
  dateSelect.disabled = true;

  try {
    availableDates = await fetchScheduleDates(movieId);

    dateSelect.innerHTML = '<option value="">Chọn ngày</option>';

    if (availableDates && availableDates.length > 0) {
      availableDates.forEach((date) => {
        const option = document.createElement("option");
        option.value = date;
        option.textContent = formatDateForDisplay(date);
        dateSelect.appendChild(option);
      });
      dateSelect.disabled = false;
    } else {
      dateSelect.innerHTML = '<option value="">Không có lịch chiếu</option>';
    }
  } catch (error) {
    console.error("Error loading dates:", error);
    dateSelect.innerHTML = '<option value="">Lỗi khi tải ngày chiếu</option>';
  }
}

function loadCinemas(movieId) {
  cinemaSelect.innerHTML = '<option value="">Chọn rạp</option>';
  cinemaSelect.disabled = false;

  // Mock cinema data - replace with actual API call if you have cinema API
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

async function loadShowtimes(movieId, date) {
  showtimeSelect.innerHTML = '<option value="">Đang tải suất chiếu...</option>';
  showtimeSelect.disabled = true;

  try {
    availableShowtimes = await fetchShowtimes(movieId, date);

    showtimeSelect.innerHTML = '<option value="">Chọn suất</option>';

    if (availableShowtimes && availableShowtimes.length > 0) {
      // Group showtimes by cinema if the API returns cinema info
      // Assuming the API returns an array of showtime objects
      availableShowtimes.forEach((showtime) => {
        const option = document.createElement("option");
        // Adjust this based on your API response structure
        option.value = showtime.id || showtime.time || showtime;
        option.textContent = showtime.time || showtime.gioChieu || showtime;
        showtimeSelect.appendChild(option);
      });
      showtimeSelect.disabled = false;
    } else {
      showtimeSelect.innerHTML =
        '<option value="">Không có suất chiếu</option>';
    }
  } catch (error) {
    console.error("Error loading showtimes:", error);
    showtimeSelect.innerHTML =
      '<option value="">Lỗi khi tải suất chiếu</option>';
  }
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
    // Tạo dữ liệu mặc định cho booking
    const movieDataForBooking = {
      title: movie.tenphim,
      date: new Date().toLocaleDateString("vi-VN"),
      time: "Chưa chọn",
      cinema: "Chưa chọn",
      movieId: movie.idPhim,
      movieDetails: movie,
    };

    // Lưu vào localStorage
    localStorage.setItem(
      "selectedMovieData",
      JSON.stringify(movieDataForBooking)
    );

    // Chuyển hướng đến trang booking
    window.location.href = `/html/chitietphim.html?id=${movieId}`;
  }
}

function notifyMovie(movieId) {
  event.stopPropagation(); // Prevent card click event
  const movie = allMovies.find((m) => m.idPhim === movieId);
  if (movie) {
    showModal(
      "successModal",
      `Đã đặt thông báo thành công cho phim: ${movie.tenphim}. Chúng tôi sẽ thông báo cho bạn khi có lịch chiếu!`
    );
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

// Updated Event Listeners for booking form
movieSelect.addEventListener("change", async function () {
  const selectedMovieId = this.value;

  if (selectedMovieId) {
    // Load cinemas and dates simultaneously
    loadCinemas(selectedMovieId);
    await loadDates(selectedMovieId);

    // Reset showtime select
    showtimeSelect.innerHTML =
      '<option value="">Vui lòng chọn ngày trước</option>';
    showtimeSelect.disabled = true;
  } else {
    // Reset and disable other fields
    cinemaSelect.innerHTML =
      '<option value="">Vui lòng chọn phim trước</option>';
    cinemaSelect.disabled = true;
    dateSelect.innerHTML = '<option value="">Vui lòng chọn phim trước</option>';
    dateSelect.disabled = true;
    showtimeSelect.innerHTML =
      '<option value="">Vui lòng chọn ngày trước</option>';
    showtimeSelect.disabled = true;
  }

  validateBookingForm();
});

cinemaSelect.addEventListener("change", function () {
  validateBookingForm();
});

dateSelect.addEventListener("change", async function () {
  const selectedMovieId = movieSelect.value;
  const selectedDate = this.value;

  if (selectedMovieId && selectedDate) {
    await loadShowtimes(selectedMovieId, selectedDate);
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
  const token = sessionStorage.getItem("authToken");
  if (!token) {
    showModal("errorModal", "Vui lòng đăng nhập trước khi thực hiện đặt phim");
    return;
  }
  const selectedMovie = allMovies.find((m) => m.idPhim === movieSelect.value);
  const selectedCinema = cinemaSelect.options[cinemaSelect.selectedIndex].text;
  const selectedDate = dateSelect.value;
  const selectedShowtime = showtimeSelect.value;

  if (selectedMovie) {
    // Chuẩn bị dữ liệu để chuyển sang trang booking
    const movieDataForBooking = {
      title: selectedMovie.tenphim,
      date: formatDateForDisplay(selectedDate),
      time: selectedShowtime,
      cinema: selectedCinema,
      movieId: selectedMovie.idPhim,
      movieDetails: selectedMovie, // Lưu toàn bộ thông tin phim
    };

    // Lưu vào localStorage thay vì sessionStorage để trang booking có thể đọc được
    localStorage.setItem(
      "selectedMovieData",
      JSON.stringify(movieDataForBooking)
    );

    // Log để debug
    console.log("Đã lưu dữ liệu phim vào localStorage:", movieDataForBooking);

    // Chuyển hướng đến trang booking
    window.location.href = "/html/datcho.html"; // Thay đổi đường dẫn theo cấu trúc thực tế của bạn
  } else {
    showModal("errorModal", "Vui lòng chọn đầy đủ thông tin trước khi đặt vé!");
  }
});

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
        const heroTitle = document.getElementById("hero-title");
        const heroDescription = document.getElementById("hero-description");

        if (heroTitle) heroTitle.textContent = featuredMovie.tenphim;
        if (heroDescription)
          heroDescription.textContent =
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
const closeModalBtn = document.querySelector(".close");
if (closeModalBtn) {
  closeModalBtn.onclick = function () {
    errorModal.style.display = "none";
  };
}

window.onclick = function (event) {
  if (event.target === errorModal) {
    errorModal.style.display = "none";
  }
};

// Mobile Menu Toggle
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", function () {
    const navMenu = document.querySelector(".nav-menu");
    if (navMenu) {
      navMenu.classList.toggle("active");
    }
  });
}

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
  const account = document.querySelector(".user-menu");

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
  if (account) {
    account.addEventListener("click", () => {
      window.location.href = "/html/taikhoan.html";
    });
  }
});
document.addEventListener("DOMContentLoaded", function () {
  console.log("sessionStorage content!", sessionStorage);
  const token = sessionStorage.getItem("authToken");

  if (token) {
    document.querySelector(".btn-login").style.display = "none";
    document.querySelector(".btn-register").style.display = "none";

    document.querySelector(".user-menu").style.display = "flex";

    // Hiện ảnh nếu có
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      if (user.avatar_url) {
        document.getElementById("userAvatar").src = user.avatar_url;
      }
      if (user.hoten) {
        document.querySelector("#name_user").innerText = user.hoten;
      }
    }
  } else {
    // Chưa đăng nhập
    document.querySelector(".btn-login").style.display = "inline-block";
    document.querySelector(".btn-register").style.display = "inline-block";

    document.querySelector(".user-menu").style.display = "none";
  }
});
