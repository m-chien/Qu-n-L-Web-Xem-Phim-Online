function loadinf() {
  const page = 1;
  const limit = 10;
  searchMovies(1, limit);
}
//hiển thị năm từ now to 2000
document.addEventListener("DOMContentLoaded", () => {
  const yearSelect = document.getElementById("year");

  // Thêm các tùy chọn năm từ năm hiện tại đến 2000
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 2000; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.textContent = year;
    yearSelect.appendChild(option);
  }
});
//tìm kiếm
async function searchMovies(page = 1) {
  try {
    const movieGrid = document.querySelector(".movie-grid");
    if (movieGrid) {
      movieGrid.style.gridTemplateColumns =
        "repeat(auto-fill, minmax(300px, 1fr))";
    }
    const token = sessionStorage.getItem("authToken");
    const userJson = JSON.parse(sessionStorage.getItem("user"));
    const user = userJson ? JSON.parse(userJson) : null;
    const keyword = document.getElementById("keyword").value.toLowerCase();
    const genre = document.getElementById("genre").value;
    const year = document.getElementById("year").value;
    const country = document.getElementById("country").value;
    const actor = document.getElementById("actor").value.toLowerCase();
    const director = document.getElementById("director").value.toLowerCase();
    const searchMovies = {
      tenPhim: keyword,
      theLoai: genre,
      nam: year,
      daodien: director,
      dienvien: actor,
      quocGia: country,
      iduser: user?.idUser || "",
    };

    // Hiển thị loading
    document.getElementById("movieResults").innerHTML =
      '<div class="loading">Đang tìm kiếm...</div>';

    const headers = {
      "Content-Type": "application/json",
    };

    // Nếu có token thì thêm Authorization header
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `http://localhost:8080/api/movies/search/${page}`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(searchMovies),
      }
    );

    if (response.ok) {
      const searchResult = await response.json();
      console.log("search API Response:", searchResult);

      setTimeout(() => {
        const filteredMovies = searchResult.result.dataList;
        const currentPage = searchResult.result.currentPage;
        const totalPages = searchResult.result.totalPages;
        const totalItems = searchResult.result.totalItems;
        displayResults(filteredMovies, totalItems);
        renderPagination(currentPage, totalPages);
      }, 800);
    } else {
      const errorText = await response.text(); // fallback: đọc lỗi dạng text
      console.error("Server error:", errorText);
      return;
    }
  } catch (error) {
    console.error("Error loading movies:", error);
  }
}
function renderPagination(currentPage, totalPages) {
  const pagination = document.getElementById("pagination");
  pagination.innerHTML = ""; // Xóa phân trang cũ

  if (totalPages <= 1) return; // Không cần phân trang nếu chỉ có 1 trang

  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.classList.add("page-btn");
    if (i === currentPage) {
      btn.classList.add("active");
    }
    btn.addEventListener("click", () => {
      searchMovies(i); // Gọi lại searchMovies với trang mới
    });
    pagination.appendChild(btn);
  }
}

function displayResults(movies, totalItems) {
  const resultsContainer = document.getElementById("movieResults");
  const resultsCount = document.getElementById("resultsCount");

  resultsCount.textContent = `${totalItems} phim được tìm thấy`;

  if (movies.length === 0) {
    resultsContainer.innerHTML = `
      <div class="no-results">
        <h3>Không tìm thấy phim nào</h3>
        <p>Vui lòng thử lại với các tiêu chí tìm kiếm khác</p>
      </div>`;
    return;
  }

  const moviesHTML = movies
    .map(
      (movie) => `
      <div class="movie-card" onclick="window.location.href='/html/chitietphim.html?id=${
        movie.idPhim
      }'" style="cursor: pointer;">
        <div class="movie-poster">
          <img src="http://localhost:8080${movie.urlPoster}" alt="${
        movie.tenPhim
      }" />
        </div>
        <div class="movie-info">
          <div class="movie-title">${movie.tenPhim}</div>
          <div class="movie-details">📅 Năm: ${movie.ngayPhatHanh}</div>
          <div class="movie-details">🎭 Đạo diễn: ${movie.daoDien}</div>
          <div class="movie-details">⭐ Diễn viên: ${(
            movie.tenDienVien || []
          ).join(", ")}</div>
          <div class="movie-genres">
            ${(movie.tenTheLoai || [])
              .map((genre) => `<span class="movie-genre">${genre}</span>`)
              .join("")}
          </div>
        </div>
      </div>
    `
    )
    .join("");

  resultsContainer.innerHTML = moviesHTML;
}

function clearSearch() {
  document.getElementById("keyword").value = "";
  document.getElementById("genre").value = "";
  document.getElementById("year").value = "";
  document.getElementById("country").value = "";
  document.getElementById("actor").value = "";
  document.getElementById("director").value = "";
  document.getElementById("movieResults").innerHTML = `
                <div class="no-results">
                    <h3>Chưa có kết quả tìm kiếm</h3>
                    <p>Vui lòng nhập thông tin tìm kiếm và nhấn nút "Tìm kiếm" để xem kết quả</p>
                </div>
            `;
  document.getElementById("resultsCount").textContent = "0 phim được tìm thấy";
  const movieGrid = document.querySelector(".movie-grid");
  if (movieGrid) {
    movieGrid.style.gridTemplateColumns =
      "repeat(auto-fill, minmax(1000px, 1fr))";
  }
}

// Thêm sự kiện Enter để tìm kiếm
document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchMovies(1);
  }
});
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
