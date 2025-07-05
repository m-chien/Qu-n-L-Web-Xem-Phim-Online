// Dữ liệu mẫu phim
const sampleMovies = [
  {
    title: "Avengers: Endgame",
    year: "2019",
    genre: "action",
    country: "us",
    director: "Anthony Russo, Joe Russo",
    actors: "Robert Downey Jr., Chris Evans, Mark Ruffalo",
    genres: ["Hành động", "Sci-Fi", "Phiêu lưu"],
  },
  {
    title: "Parasite",
    year: "2019",
    genre: "thriller",
    country: "korea",
    director: "Bong Joon-ho",
    actors: "Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong",
    genres: ["Thriller", "Chính kịch"],
  },
  {
    title: "Spider-Man: No Way Home",
    year: "2021",
    genre: "action",
    country: "us",
    director: "Jon Watts",
    actors: "Tom Holland, Zendaya, Benedict Cumberbatch",
    genres: ["Hành động", "Phiêu lưu", "Sci-Fi"],
  },
  {
    title: "Spirited Away",
    year: "2001",
    genre: "animation",
    country: "japan",
    director: "Hayao Miyazaki",
    actors: "Rumi Hiiragi, Miyu Irino, Mari Natsuki",
    genres: ["Hoạt hình", "Giả tưởng", "Gia đình"],
  },
  {
    title: "The Dark Knight",
    year: "2008",
    genre: "action",
    country: "us",
    director: "Christopher Nolan",
    actors: "Christian Bale, Heath Ledger, Aaron Eckhart",
    genres: ["Hành động", "Tội phạm", "Chính kịch"],
  },
  {
    title: "Your Name",
    year: "2016",
    genre: "animation",
    country: "japan",
    director: "Makoto Shinkai",
    actors: "Ryunosuke Kamiki, Mone Kamishiraishi",
    genres: ["Hoạt hình", "Lãng mạn", "Siêu nhiên"],
  },
  {
    title: "Joker",
    year: "2019",
    genre: "drama",
    country: "us",
    director: "Todd Phillips",
    actors: "Joaquin Phoenix, Robert De Niro",
    genres: ["Chính kịch", "Tội phạm", "Thriller"],
  },
  {
    title: "Train to Busan",
    year: "2016",
    genre: "horror",
    country: "korea",
    director: "Yeon Sang-ho",
    actors: "Gong Yoo, Jung Yu-mi, Ma Dong-seok",
    genres: ["Kinh dị", "Hành động", "Thriller"],
  },
];
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
function searchMovies() {
  const keyword = document.getElementById("keyword").value.toLowerCase();
  const genre = document.getElementById("genre").value;
  const year = document.getElementById("year").value;
  const country = document.getElementById("country").value;
  const actor = document.getElementById("actor").value.toLowerCase();
  const director = document.getElementById("director").value.toLowerCase();

  // Hiển thị loading
  document.getElementById("movieResults").innerHTML =
    '<div class="loading">Đang tìm kiếm...</div>';

  // Simulate API delay
  setTimeout(() => {
    let filteredMovies = sampleMovies.filter((movie) => {
      const matchesKeyword =
        !keyword || movie.title.toLowerCase().includes(keyword);
      const matchesGenre = !genre || movie.genre === genre;
      const matchesYear = !year || movie.year === year;
      const matchesCountry = !country || movie.country === country;
      const matchesActor = !actor || movie.actors.toLowerCase().includes(actor);
      const matchesDirector =
        !director || movie.director.toLowerCase().includes(director);

      return (
        matchesKeyword &&
        matchesGenre &&
        matchesYear &&
        matchesCountry &&
        matchesActor &&
        matchesDirector
      );
    });

    displayResults(filteredMovies);
  }, 800);
}

function displayResults(movies) {
  const resultsContainer = document.getElementById("movieResults");
  const resultsCount = document.getElementById("resultsCount");

  resultsCount.textContent = `${movies.length} phim được tìm thấy`;

  if (movies.length === 0) {
    resultsContainer.innerHTML = `
                    <div class="no-results">
                        <h3>Không tìm thấy phim nào</h3>
                        <p>Vui lòng thử lại với các tiêu chí tìm kiếm khác</p>
                    </div>
                `;
    return;
  }

  const moviesHTML = movies
    .map(
      (movie) => `
                <div class="movie-card">
                    <div class="movie-poster">
                        🎬 ${movie.title}
                    </div>
                    <div class="movie-info">
                        <div class="movie-title">${movie.title}</div>
                        <div class="movie-details">📅 Năm: ${movie.year}</div>
                        <div class="movie-details">🎭 Đạo diễn: ${
                          movie.director
                        }</div>
                        <div class="movie-details">⭐ Diễn viên: ${
                          movie.actors
                        }</div>
                        <div class="movie-genres">
                            ${movie.genres
                              .map(
                                (genre) =>
                                  `<span class="movie-genre">${genre}</span>`
                              )
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
}

// Thêm sự kiện Enter để tìm kiếm
document.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    searchMovies();
  }
});

// Load một số phim mẫu khi trang được tải
window.addEventListener("load", function () {
  setTimeout(() => {
    displayResults(sampleMovies.slice(0, 4));
  }, 1000);
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
