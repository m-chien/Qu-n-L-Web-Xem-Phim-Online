// API Configuration - phải khớp với trangchu.js
const API_BASE_URL = "http://localhost:8080/api";
const MOVIES_ENDPOINT = `${API_BASE_URL}/movies`;

document.addEventListener("DOMContentLoaded", async () => {
  const loadingContainer = document.getElementById("loading-container");
  const movieDetailSection = document.getElementById("movie-detail");
  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("id");

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

      displayMovieDetails(movie);
    } else {
      const apiResponse = await response.json();
      console.log("API Response:", apiResponse);

      // Xử lý ApiResponse wrapper - lấy dữ liệu từ result
      const movie = apiResponse.result || apiResponse;
      displayMovieDetails(movie);
    }

    // Load rạp chiếu
    await loadCinemas(movieId);

    // Load phim liên quan
    await loadRelatedMovies(movieId);

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

async function loadCinemas(movieId) {
  const selectCinema = document.getElementById("cinema-select");

  try {
    // Thử API rạp chiếu theo phim trước
    let response;
    try {
      response = await fetch(`${API_BASE_URL}/phim/${movieId}/rap`);
    } catch (error) {
      // Nếu không có API này, dùng mock data
      console.log("Sử dụng mock data cho rạp chiếu");
      const mockCinemas = [
        { id: 1, tenRap: "Galaxy Nguyễn Du", name: "Galaxy Nguyễn Du" },
        { id: 2, tenRap: "Galaxy Đà Nẵng", name: "Galaxy Đà Nẵng" },
        {
          id: 3,
          tenRap: "Galaxy Kinh Dương Vương",
          name: "Galaxy Kinh Dương Vương",
        },
      ];

      mockCinemas.forEach((rap) => {
        const option = document.createElement("option");
        option.value = rap.id;
        option.textContent = rap.tenRap || rap.name;
        selectCinema.appendChild(option);
      });

      setupCinemaEvents(movieId);
      return;
    }

    if (response && response.ok) {
      const cinemas = await response.json();
      cinemas.forEach((rap) => {
        const option = document.createElement("option");
        option.value = rap.id;
        option.textContent = rap.tenRap || rap.name;
        selectCinema.appendChild(option);
      });
    }

    setupCinemaEvents(movieId);
  } catch (error) {
    console.error("Lỗi tải rạp:", error);
    // Fallback to mock data
    const mockCinemas = [
      { id: 1, tenRap: "Galaxy Nguyễn Du" },
      { id: 2, tenRap: "Galaxy Đà Nẵng" },
      { id: 3, tenRap: "Galaxy Kinh Dương Vương" },
    ];

    mockCinemas.forEach((rap) => {
      const option = document.createElement("option");
      option.value = rap.id;
      option.textContent = rap.tenRap;
      selectCinema.appendChild(option);
    });

    setupCinemaEvents(movieId);
  }
}

function setupCinemaEvents(movieId) {
  const selectCinema = document.getElementById("cinema-select");
  const dateInput = document.getElementById("date-select");
  const showtimeSelect = document.getElementById("showtime-select");

  // Set minimum date to today
  const today = new Date().toISOString().split("T")[0];
  dateInput.min = today;

  selectCinema.addEventListener("change", async () => {
    const selectedRapId = selectCinema.value;

    dateInput.disabled = !selectedRapId;
    showtimeSelect.innerHTML = '<option value="">Chọn ngày trước</option>';
    showtimeSelect.disabled = true;
    document.getElementById("btn-book-ticket").disabled = true;

    if (!selectedRapId) return;

    dateInput.addEventListener("change", async () => {
      const selectedDate = dateInput.value;
      if (!selectedDate) return;

      try {
        let response;
        try {
          response = await fetch(
            `${API_BASE_URL}/lichchieu?phimId=${movieId}&rapId=${selectedRapId}&ngay=${selectedDate}`
          );
        } catch (error) {
          // Mock showtime data if API not available
          console.log("Sử dụng mock data cho suất chiếu");
          const mockShowtimes = [
            { id: 1, gioChieu: "10:00" },
            { id: 2, gioChieu: "13:00" },
            { id: 3, gioChieu: "16:00" },
            { id: 4, gioChieu: "19:00" },
            { id: 5, gioChieu: "22:00" },
          ];

          showtimeSelect.innerHTML =
            '<option value="">Chọn suất chiếu</option>';
          mockShowtimes.forEach((suat) => {
            const option = document.createElement("option");
            option.value = suat.id;
            option.textContent = suat.gioChieu;
            showtimeSelect.appendChild(option);
          });

          showtimeSelect.disabled = false;
          setupBookingButton();
          return;
        }

        if (response && response.ok) {
          const showtimes = await response.json();

          showtimeSelect.innerHTML =
            '<option value="">Chọn suất chiếu</option>';
          if (showtimes.length === 0) {
            showtimeSelect.innerHTML = `<option value="">Không có suất chiếu</option>`;
            showtimeSelect.disabled = true;
            return;
          }

          showtimes.forEach((suat) => {
            const option = document.createElement("option");
            option.value = suat.id;
            option.textContent = suat.gioChieu;
            showtimeSelect.appendChild(option);
          });

          showtimeSelect.disabled = false;
          setupBookingButton();
        }
      } catch (error) {
        console.error("Lỗi lấy suất chiếu:", error);
      }
    });
  });
}

function setupBookingButton() {
  const showtimeSelect = document.getElementById("showtime-select");
  const bookButton = document.getElementById("btn-book-ticket");

  showtimeSelect.addEventListener("change", () => {
    bookButton.disabled = !showtimeSelect.value;
  });

  bookButton.addEventListener("click", () => {
    const movieTitle = document.getElementById("movie-title").textContent;
    const cinemaName =
      document.getElementById("cinema-select").options[
        document.getElementById("cinema-select").selectedIndex
      ].text;
    const selectedDate = document.getElementById("date-select").value;
    const selectedTime =
      document.getElementById("showtime-select").options[
        document.getElementById("showtime-select").selectedIndex
      ].text;

    alert(
      `Đặt vé thành công!\nPhim: ${movieTitle}\nRạp: ${cinemaName}\nNgày: ${selectedDate}\nSuất: ${selectedTime}`
    );

    // Uncomment if you have booking page
    // window.location.href = '/html/datve.html';
  });
}

async function loadRelatedMovies(currentMovieId) {
  const container = document.getElementById("related-movies-grid");
  if (!container) return;

  try {
    // Lấy tất cả phim để tìm phim liên quan
    const response = await fetch(MOVIES_ENDPOINT);
    if (!response.ok) throw new Error("Không thể tải phim liên quan");

    const allMovies = (await response.json()).result;

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
              ? `<img src="${movie.url_anh}" alt="${movie.tenphim}" style="width: 100%; height: 300px; object-fit: cover;" />`
              : `<div class="poster-placeholder" style="height: 300px; display: flex; align-items: center; justify-content: center; background: #f0f0f0;">
                <i class="fas fa-film"></i>
               </div>`
          }
        </div>
        <div class="movie-info">
          <h4>${movie.tenphim}</h4>
          <p>${movie.quocgia || "Chưa rõ"} • ${movie.gioihandotuoi || 0}</p>
        </div>
        <div class ="xem_chi-tiet">
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

// Error modal handlers
document.addEventListener("DOMContentLoaded", () => {
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
});
//đăng ký/đăng nhập
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
//cuộn xuống phần đặt phim
const scrollButton = document.getElementById("btn-book-movie");
const targetSection = document.getElementById("booking-section");
scrollButton.addEventListener("click", () => {
  targetSection.scrollIntoView({
    behavior: "smooth", // Hiệu ứng cuộn mượt mà
    block: "start", // Cuộn sao cho đầu phần tử đích hiển thị ở đầu viewport
  });
});
