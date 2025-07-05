// API Configuration - phải khớp với trangchu.js
const API_BASE_URL = "http://localhost:8080/api";
const MOVIES_ENDPOINT = `${API_BASE_URL}/movies`;
const SCHEDULE_ENDPOINT = `${API_BASE_URL}/schedule/date`;
const SHOWTIME_ENDPOINT = `${API_BASE_URL}/showtime`;
const loadingContainer = document.getElementById("loading-container");
const movieDetailSection = document.getElementById("movie-detail");
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");
const cinemaSelect = document.getElementById("cinema-select");
const dateSelect = document.getElementById("date-select");
const showtimeSelect = document.getElementById("showtime-select");
const bookButton = document.getElementById("btn-book-ticket");

let currentMovieDetails = null;
let availableDates = [];
let availableShowtimes = [];

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

document.addEventListener("DOMContentLoaded", async () => {
  // Initialize user menu display
  updateUserMenuDisplay();

  if (!movieId) {
    showError("Không tìm thấy ID phim.");
    return;
  }

  try {
    // Gọi API chi tiết phim
    const response = await fetch(`${MOVIES_ENDPOINT}/${movieId}`);
    if (!response.ok) {
      // Nếu không có API chi tiết, thử lấy tất cả phim rồi filter
      const allMoviesResponse = await fetch(MOVIES_ENDPOINT);
      if (!allMoviesResponse.ok) throw new Error("Lỗi khi lấy dữ liệu phim");

      const allMovies = await allMoviesResponse.json();
      const movie = allMovies.find((m) => m.idPhim === movieId);
      if (!movie) throw new Error("Không tìm thấy phim");
      currentMovieDetails = movie;
      displayMovieDetails(movie);
    } else {
      const apiResponse = await response.json();
      console.log("API Response:", apiResponse);

      // Xử lý ApiResponse wrapper - lấy dữ liệu từ result
      currentMovieDetails = apiResponse.result || apiResponse;
      displayMovieDetails(currentMovieDetails);
    }

    // Load phim liên quan
    await loadRelatedMovies(movieId);

    // Load initial cinema options and setup event listeners
    setupBookingForm();

    // Hiển thị nội dung
    loadingContainer.style.display = "none";
    movieDetailSection.style.display = "block";
  } catch (error) {
    console.error(error);
    showError("Không thể tải thông tin phim.");
  }
});

function displayMovieDetails(data) {
  // Gán dữ liệu vào giao diện - điều chỉnh theo cấu trúc API của bạn
  document.getElementById("movie-title").textContent =
    data.tenphim || data.tenPhim || "Chưa có tên";

  // Poster và backdrop
  if (data.url_anh) {
    document.getElementById("movie-poster").src = data.url_anh;
    document.getElementById(
      "movie-backdrop"
    ).style.backgroundImage = `url(${data.url_anh})`;
  }

  document.getElementById("movie-description").textContent =
    data.moTaPhim || data.moTa || "Chưa có mô tả";

  // Năm sản xuất
  if (data.ngaySanXuat || data.ngayKhoiChieu) {
    const year = new Date(data.ngaySanXuat || data.ngayKhoiChieu).getFullYear();
    document.getElementById("movie-year").textContent = year;
  }

  // Rating từ lượt xem
  const rating = data.luotXem
    ? Math.min(Math.round(data.luotXem / 1000), 10)
    : 0;
  document
    .getElementById("movie-rating")
    .querySelector("#rating-value").textContent = rating;

  document.getElementById("movie-duration").textContent = data.thoiLuong
    ? `${data.thoiLuong} phút`
    : "Chưa rõ";
  document.getElementById("movie-age-rating").textContent =
    data.gioihandotuoi || data.doTuoi || "Chưa rõ";
  document.getElementById("movie-country").textContent =
    data.quocgia || data.quocGia || "Chưa rõ";
  document.getElementById("movie-director").textContent =
    data.daodien || data.daoDien || "Chưa rõ";
  document.getElementById("movie-status").textContent =
    data.trangthai || data.trangThai || "Chưa rõ";

  // Stats
  document.getElementById("view-count").textContent = data.luotXem || 0;
  document.getElementById("release-date").textContent =
    data.ngaySanXuat || data.ngayKhoiChieu || "Chưa rõ";
  document.getElementById("duration-stat").textContent = data.thoiLuong
    ? `${data.thoiLuong} phút`
    : "Chưa rõ";
  document.getElementById("country-stat").textContent =
    data.quocgia || data.quocGia || "Chưa rõ";

  // Thể loại - hiển thị dưới dạng nút bấm trong movie-genres
  displayGenres(data.tentheloai || data.theLoai || []);

  // Diễn viên - thêm vào sau phần director
  displayActors(data.tendienvien || data.dienVien || []);
}

function displayGenres(genres) {
  const genreContainer = document.getElementById("movie-genres");
  if (!genreContainer) return;

  // Xóa nội dung cũ nhưng giữ lại country tag
  const countryTag = genreContainer.querySelector(".genre-tag");
  genreContainer.innerHTML = "";
  if (countryTag) {
    genreContainer.appendChild(countryTag);
  }

  if (!genres || genres.length === 0) {
    const noGenreSpan = document.createElement("span");
    noGenreSpan.className = "no-data";
    noGenreSpan.textContent = "Chưa có thông tin thể loại";
    genreContainer.appendChild(noGenreSpan);
    return;
  }

  // Nếu genres là string, chuyển thành array
  const genreArray = Array.isArray(genres) ? genres : [genres];

  genreArray.forEach((genre) => {
    const genreButton = document.createElement("button");
    genreButton.className = "genre-btn";
    genreButton.textContent = genre;
    genreButton.onclick = () => {
      // Chuyển đến trang tìm kiếm với thể loại
      window.location.href = `/html/timkiem.html?theloai=${encodeURIComponent(
        genre
      )}`;
    };
    genreContainer.appendChild(genreButton);
  });
}

function displayActors(actors) {
  // Tìm phần director section để thêm actors sau đó
  const directorSection = document.getElementById("movie-director-section");
  if (!directorSection) return;

  // Xóa phần actors cũ nếu có
  let actorSection = document.getElementById("movie-actors-section");
  if (actorSection) {
    actorSection.remove();
  }

  // Tạo phần actors mới
  actorSection = document.createElement("div");
  actorSection.id = "movie-actors-section";
  actorSection.className = "movie-actors";

  const actorLabel = document.createElement("strong");
  actorLabel.textContent = "Diễn viên: ";
  actorSection.appendChild(actorLabel);

  if (!actors || actors.length === 0) {
    const noActorSpan = document.createElement("span");
    noActorSpan.className = "no-data";
    noActorSpan.textContent = "Chưa có thông tin diễn viên";
    actorSection.appendChild(noActorSpan);
  } else {
    // Nếu actors là string, chuyển thành array
    const actorArray = Array.isArray(actors) ? actors : [actors];

    const actorContainer = document.createElement("div");
    actorContainer.className = "actor-buttons-container";

    actorArray.forEach((actor) => {
      const actorButton = document.createElement("button");
      actorButton.className = "actor-btn";
      actorButton.textContent = actor;
      actorButton.onclick = () => {
        // Chuyển đến trang tìm kiếm với diễn viên
        window.location.href = `/html/timkiem.html?dienvien=${encodeURIComponent(
          actor
        )}`;
      };
      actorContainer.appendChild(actorButton);
    });

    actorSection.appendChild(actorContainer);
  }

  // Thêm phần actors sau director section
  directorSection.parentNode.insertBefore(
    actorSection,
    directorSection.nextSibling
  );
}

function showError(message) {
  document.getElementById("loading-container").style.display = "none";
  const modal = document.getElementById("error-modal");
  document.getElementById("error-message").textContent = message;
  modal.style.display = "block";
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
    showModal("error-modal", "Không thể tải ngày chiếu. Vui lòng thử lại sau.");
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
    showModal("error-modal", "Không thể tải suất chiếu. Vui lòng thử lại sau.");
    return [];
  }
}

// Hàm lấy ngày chiếu
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

// Hàm lấy suất chiếu
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

// Form validation and enable/disable logic
function validateBookingForm() {
  const movieSelected = movieId !== "";
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

// Setup booking form event listeners
function setupBookingForm() {
  // Đảm bảo elements tồn tại
  if (!cinemaSelect || !dateSelect || !showtimeSelect || !bookButton) {
    console.error("Missing required elements for booking form");
    return;
  }

  // Tạo options cho cinema select
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
    option.value = cinema.name; // Sử dụng tên rạp làm value
    option.textContent = cinema.name;
    cinemaSelect.appendChild(option);
  });

  cinemaSelect.dispatchEvent(new Event("change"));

  // Event listeners
  cinemaSelect.addEventListener("change", async function () {
    console.log(
      "Cinema changed to:",
      this.value,
      "Text:",
      this.options[this.selectedIndex].text
    );

    if (this.value && movieId) {
      await loadDates(movieId);
    } else {
      dateSelect.innerHTML =
        '<option value="">Vui lòng chọn rạp trước</option>';
      dateSelect.disabled = true;
      showtimeSelect.innerHTML =
        '<option value="">Vui lòng chọn ngày trước</option>';
      showtimeSelect.disabled = true;
    }
    validateBookingForm();
  });

  dateSelect.addEventListener("change", async function () {
    const selectedDate = this.value;
    console.log("Date changed to:", selectedDate);

    if (movieId && selectedDate) {
      await loadShowtimes(movieId, selectedDate);
    } else {
      showtimeSelect.innerHTML =
        '<option value="">Vui lòng chọn ngày trước</option>';
      showtimeSelect.disabled = true;
    }

    validateBookingForm();
  });

  showtimeSelect.addEventListener("change", function () {
    console.log("Showtime changed to:", this.value);
    validateBookingForm();
  });

  bookButton.addEventListener("click", async function () {
    console.log("Book button clicked!");

    const token = sessionStorage.getItem("authToken");
    if (!token) {
      showModal(
        "error-modal",
        "Vui lòng đăng nhập trước khi thực hiện đặt phim"
      );
      return;
    }

    const selectedMovie = currentMovieDetails;
    const selectedCinema = cinemaSelect.value; // Lấy value trực tiếp thay vì text
    const selectedDate = dateSelect.value;
    const selectedShowtime = showtimeSelect.value;

    console.log("Booking data:", {
      movie: selectedMovie?.tenphim || selectedMovie?.tenPhim,
      cinema: selectedCinema,
      date: selectedDate,
      showtime: selectedShowtime,
    });

    if (selectedMovie && selectedCinema && selectedDate && selectedShowtime) {
      // Chuẩn bị dữ liệu để chuyển sang trang booking
      const movieDataForBooking = {
        title: selectedMovie.tenphim || selectedMovie.tenPhim,
        date: formatDateForDisplay(selectedDate),
        time: selectedShowtime,
        cinema: selectedCinema,
        movieId: selectedMovie.idPhim,
        movieDetails: selectedMovie,
      };

      // Lưu vào localStorage
      localStorage.setItem(
        "selectedMovieData",
        JSON.stringify(movieDataForBooking)
      );

      console.log("Đã lưu dữ liệu phim vào localStorage:", movieDataForBooking);

      // Chuyển hướng đến trang booking
      window.location.href = "/html/datcho.html";
    } else {
      showModal(
        "error-modal",
        "Vui lòng chọn đầy đủ thông tin trước khi đặt vé!"
      );
    }
  });

  // Gọi validateBookingForm ban đầu
  validateBookingForm();
}

// Hiện phim liên quan
async function loadRelatedMovies(currentMovieId) {
  const container = document.getElementById("related-movies-grid");
  if (!container) return;

  try {
    // Lấy tất cả phim để tìm phim liên quan
    const response = await fetch(MOVIES_ENDPOINT);
    if (!response.ok) throw new Error("Không thể tải phim liên quan");

    const apiResponse = await response.json();
    const allMovies = apiResponse.result || apiResponse;

    // Lọc ra những phim khác (trừ phim hiện tại)
    const relatedMovies = allMovies
      .filter((m) => m.idPhim !== currentMovieId)
      .slice(0, 5);

    container.innerHTML = ""; // Clear existing content

    if (relatedMovies.length === 0) {
      container.innerHTML = "<p>Không có phim liên quan</p>";
      return;
    }

    relatedMovies.forEach((movie) => {
      const div = document.createElement("div");
      div.className = "movie-card";
      div.innerHTML = `
        <div class="movie-poster">
          ${
            movie.url_anh
              ? `<img src="${movie.url_anh}" alt="${
                  movie.tenphim || movie.tenPhim
                }" style="width: 100%; height: 300px; object-fit: cover;" />`
              : `<div class="poster-placeholder" style="height: 300px; display: flex; align-items: center; justify-content: center; background: #f0f0f0;">
                <i class="fas fa-film"></i>
               </div>`
          }
        </div>
        <div class="movie-info">
          <h4>${movie.tenphim || movie.tenPhim}</h4>
          <p>${movie.quocgia || movie.quocGia || "Chưa rõ"} • ${
        movie.gioihandotuoi || movie.doTuoi || 0
      }</p>
        </div>
        <div class="xem_chi-tiet">
          <a href="/html/chitietphim.html?id=${
            movie.idPhim
          }" class="btn-sm">Xem chi tiết</a>
        </div>
      `;
      container.appendChild(div);
    });
  } catch (error) {
    console.error("Lỗi tải phim liên quan:", error);
    if (container) {
      container.innerHTML = "<p>Không thể tải phim liên quan</p>";
    }
  }
}

// Update user menu display
function updateUserMenuDisplay() {
  console.log("sessionStorage content!", sessionStorage);
  const token = sessionStorage.getItem("authToken");
  const loginButton = document.querySelector(".btn-login");
  const registerButton = document.querySelector(".btn-register");
  const userMenu = document.querySelector(".user-menu");

  if (token) {
    if (loginButton) loginButton.style.display = "none";
    if (registerButton) registerButton.style.display = "none";
    if (userMenu) userMenu.style.display = "flex";

    // Hiện ảnh nếu có
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      const userAvatar = document.getElementById("userAvatar");
      const nameUser = document.querySelector("#name_user");

      if (user.avatar_url && userAvatar) {
        userAvatar.src = user.avatar_url;
      }
      if (user.hoten && nameUser) {
        nameUser.innerText = user.hoten;
      }
    }
  } else {
    // Chưa đăng nhập
    if (loginButton) loginButton.style.display = "inline-block";
    if (registerButton) registerButton.style.display = "inline-block";
    if (userMenu) userMenu.style.display = "none";
  }
}

// Error modal handlers
function setupErrorModal() {
  const closeModal = document.querySelector(".close");
  const errorModal = document.getElementById("error-modal");

  if (closeModal) {
    closeModal.onclick = function () {
      errorModal.style.display = "none";
    };
  }

  window.onclick = function (event) {
    if (event.target === errorModal) {
      errorModal.style.display = "none";
    }
  };
}

// Đăng ký/đăng nhập
function setupAuthButtons() {
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
}

// Cuộn xuống phần đặt phim
function setupScrollButton() {
  const scrollButton = document.getElementById("btn-book-movie");
  const targetSection = document.getElementById("booking-section");

  if (scrollButton && targetSection) {
    scrollButton.addEventListener("click", () => {
      targetSection.scrollIntoView({
        behavior: "smooth", // Hiệu ứng cuộn mượt mà
        block: "start", // Cuộn sao cho đầu phần tử đích hiển thị ở đầu viewport
      });
    });
  }
}

// Initialize all components when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  setupErrorModal();
  setupAuthButtons();
  setupScrollButton();
});
