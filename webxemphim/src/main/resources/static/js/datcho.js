// Dữ liệu từ localStorage
let movieData = {};
let roomData = {};

const seatPrices = {
  normal: 100000,
  vip: 150000,
};

// Khởi tạo dữ liệu ghế
const totalRows = 10;
const seatsPerRow = 14;
let selectedSeats = [];
let occupiedSeats = [];

// Lấy dữ liệu từ localStorage
function getDataFromStorage() {
  try {
    // Lấy thông tin phim từ localStorage
    const storedMovieData = localStorage.getItem("selectedMovieData");
    if (storedMovieData) {
      movieData = JSON.parse(storedMovieData);
      console.log("Dữ liệu phim từ localStorage:", movieData);
    } else {
      console.warn("Không tìm thấy dữ liệu phim trong localStorage");

      // Thử lấy từ sessionStorage nếu có (fallback)
      const sessionMovieData = sessionStorage.getItem("bookingInfo");
      if (sessionMovieData) {
        const sessionData = JSON.parse(sessionMovieData);
        movieData = {
          title: sessionData.movie?.tenphim || "Phim mặc định",
          date: sessionData.date || new Date().toLocaleDateString("vi-VN"),
          time: sessionData.showtime || "19:30",
          cinema: sessionData.cinema || "CineMax Vincom",
          movieId: sessionData.movie?.idPhim,
          poster: sessionData.movie?.url_anh,
        };
        console.log("Đã lấy dữ liệu từ sessionStorage:", movieData);
      } else {
        // Dữ liệu mặc định nếu không có trong cả localStorage và sessionStorage
        movieData = {
          title: "Phim mặc định",
          date: new Date().toLocaleDateString("vi-VN"),
          time: "19:30",
          cinema: "CineMax Vincom",
        };
        console.log("Sử dụng dữ liệu mặc định:", movieData);
      }
    }
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu từ localStorage:", error);
    // Dữ liệu mặc định
    movieData = {
      title: "Phim mặc định",
      date: new Date().toLocaleDateString("vi-VN"),
      time: "19:30",
      cinema: "CineMax Vincom",
    };
  }
}
function cleanupBookingData() {
  try {
    localStorage.removeItem("selectedMovieData");
    sessionStorage.removeItem("bookingInfo");
    console.log("Đã xóa dữ liệu booking cũ");
  } catch (error) {
    console.error("Lỗi khi xóa dữ liệu:", error);
  }
}
async function fetchRoomData() {
  try {
    // Chuyển đổi định dạng ngày nếu là dạng "Th 6, 07/06/2024"
    let formattedDate = movieData.date;
    if (movieData.date && movieData.date.includes("/")) {
      const dateParts = movieData.date.split(", ")[1].split("/");
      formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // yyyy-MM-dd
    }

    const params = new URLSearchParams({
      tenphim: movieData.title || "",
      suat: movieData.time || "",
      ngay: formattedDate || "",
    });

    const response = await fetch(`http://localhost:8080/api/room?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Dữ liệu phòng từ API:", data);
    localStorage.setItem("Room", data);
    roomData = data;
    return data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu phòng:", error);
    roomData = { tenphong: "Phòng 1" }; // fallback
    return roomData;
  }
}

// Lấy danh sách ghế đã đặt từ API
async function fetchOccupiedSeats() {
  try {
    // Chuyển đổi định dạng ngày nếu là dạng "Th 6, 07/06/2024"
    let formattedDate = movieData.date;
    if (movieData.date && movieData.date.includes("/")) {
      const dateParts = movieData.date.split(", ")[1].split("/");
      formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`; // yyyy-MM-dd
    }

    // Lấy thông tin phòng
    const room = await fetchRoomData();
    const idPhong = room.idphong || room.idPhong || room.maPhong;

    // Tạo query params
    const redisParams = new URLSearchParams({
      suatchieu: movieData.time || "",
      idphong: idPhong,
      ngaydat: formattedDate || "",
    });
    const params = new URLSearchParams({
      tenphim: movieData.title || "",
      suat: movieData.time || "",
      ngay: formattedDate || "",
    });

    // Gọi cả 2 API song song
    const [heldRes, bookedRes] = await Promise.all([
      fetch(`http://localhost:8080/api/booking/ghe?${redisParams}`),
      fetch(`http://localhost:8080/api/seat?${params}`),
    ]);

    if (!heldRes.ok || !bookedRes.ok) {
      throw new Error(`Lỗi response: ${heldRes.status} / ${bookedRes.status}`);
    }

    const heldData = await heldRes.json(); // từ Redis
    const bookedData = await bookedRes.json(); // từ DB

    const heldSeatIds = heldData.map((seat) => `${seat.hang}${seat.cot}`);
    const bookedSeatIds = bookedData.map((seat) => `${seat.hang}${seat.cot}`);
    const allOccupied = [...new Set([...bookedSeatIds, ...heldSeatIds])];

    return allOccupied;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu ghế đã đặt:", error);
    return [];
  }
}

// Tạo layout ghế
function createSeatsLayout() {
  const container = document.getElementById("seatsContainer");
  container.innerHTML = "";

  for (let i = 0; i < totalRows; i++) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "row";

    const rowLabel = document.createElement("div");
    rowLabel.className = "row-label";
    rowLabel.textContent = String.fromCharCode(65 + i); // A, B, C, ...
    rowDiv.appendChild(rowLabel);

    for (let j = 1; j <= seatsPerRow; j++) {
      // Tạo lối đi ở giữa
      if (j === 8) {
        const aisle = document.createElement("div");
        aisle.className = "aisle";
        rowDiv.appendChild(aisle);
      }

      const seat = document.createElement("div");
      seat.className = "seat";
      seat.dataset.row = String.fromCharCode(65 + i);
      seat.dataset.number = j;
      seat.dataset.seatId = `${String.fromCharCode(65 + i)}${j}`;
      seat.textContent = j;

      // Ghế VIP (3 hàng cuối)
      if (i >= 7) {
        seat.classList.add("vip");
      }

      seat.addEventListener("click", handleSeatClick);
      rowDiv.appendChild(seat);
    }

    container.appendChild(rowDiv);
  }
}

// Xử lý click ghế
function handleSeatClick(event) {
  const seat = event.target;
  const seatId = seat.dataset.seatId;

  if (seat.classList.contains("occupied")) {
    return; // Không cho phép chọn ghế đã đặt
  }

  if (seat.classList.contains("selected")) {
    // Bỏ chọn ghế
    seat.classList.remove("selected");
    seat.classList.add("available");
    selectedSeats = selectedSeats.filter((id) => id !== seatId);
  } else {
    // Chọn ghế
    seat.classList.remove("available");
    seat.classList.add("selected");
    selectedSeats.push(seatId);
  }
  console.log("Ghế được chọn:", selectedSeats);
  updateBookingSummary();
}

// Cập nhật thông tin đặt vé
function updateBookingSummary() {
  const seatsList = document.getElementById("selectedSeatsList");
  const totalPrice = document.getElementById("totalPrice");
  const continueBtn = document.getElementById("continueBtn");

  if (selectedSeats.length === 0) {
    seatsList.innerHTML =
      '<span style="color: #7f8c8d;">Chưa chọn ghế nào</span>';
    totalPrice.textContent = "0";
    continueBtn.disabled = true;
  } else {
    seatsList.innerHTML = selectedSeats
      .map((seatId) => `<span class="seat-tag">${seatId}</span>`)
      .join("");

    // Tính tổng tiền
    let total = 0;
    selectedSeats.forEach((seatId) => {
      const row = seatId.charAt(0);
      const rowIndex = row.charCodeAt(0) - 65;
      if (rowIndex >= 7) {
        total += seatPrices.vip;
      } else {
        total += seatPrices.normal;
      }
    });

    totalPrice.textContent = total.toLocaleString();
    continueBtn.disabled = false;
  }
}

// Đánh dấu ghế đã đặt
function markOccupiedSeats(occupiedSeatIds) {
  if (!Array.isArray(occupiedSeatIds) || occupiedSeatIds.length === 0) {
    console.log("Không có ghế nào đã được đặt");
    return;
  }
  console.log("Ghế bị chiếm (seatId):", occupiedSeatIds);
  occupiedSeatIds.forEach((seatId) => {
    const seatElement = document.querySelector(`[data-seat-id="${seatId}"]`);
    if (seatElement) {
      seatElement.classList.add("occupied");
      seatElement.classList.remove("available", "vip");
    } else {
      console.warn(`Không tìm thấy ghế với ID: ${seatId}`);
    }
  });
}

// Đánh dấu ghế có sẵn
function markAvailableSeats() {
  const allSeats = document.querySelectorAll(".seat");
  allSeats.forEach((seat) => {
    if (!seat.classList.contains("occupied")) {
      seat.classList.add("available");
    }
  });
}

// Hiển thị thông tin phim và phòng
function displayMovieInfo() {
  try {
    // Hiển thị thông tin phim từ localStorage
    document.getElementById("movieTitle").textContent =
      movieData.title || "Tên phim";
    document.getElementById("selectedDate").textContent =
      movieData.date || "Ngày chiếu";
    document.getElementById("selectedTime").textContent =
      movieData.time || "Giờ chiếu";
    document.getElementById("cinemaName").textContent =
      movieData.cinema || "Tên rạp";

    // Hiển thị tên phòng từ API
    document.getElementById("roomName").textContent =
      roomData.tenphong || "Phòng chiếu";
    const posterImg = document.getElementById("posterImage");
    if (posterImg) {
      posterImg.src = movieData.movieDetails.url_anh || "/images/default.jpg"; // Đường dẫn ảnh mặc định nếu thiếu
    }
  } catch (error) {
    console.error("Lỗi khi hiển thị thông tin phim:", error);
  }
}

// Khởi tạo trang
async function initializePage() {
  try {
    // Lấy dữ liệu từ localStorage
    getDataFromStorage();

    // Lấy thông tin phòng từ API
    await fetchRoomData();

    // Hiển thị thông tin phim và phòng
    displayMovieInfo();

    // Tạo layout ghế
    createSeatsLayout();

    // Lấy dữ liệu ghế đã đặt từ API
    occupiedSeats = await fetchOccupiedSeats();

    // Ẩn loading và hiển thị ghế
    document.getElementById("loadingSpinner").style.display = "none";
    document.getElementById("seatsContainer").style.display = "flex";

    // Đánh dấu ghế đã đặt và ghế có sẵn
    markOccupiedSeats(occupiedSeats);
    markAvailableSeats();
    setInterval(async () => {
      const updatedOccupiedSeats = await fetchOccupiedSeats();
      markOccupiedSeats(updatedOccupiedSeats);
      markAvailableSeats();
    }, 10000); // hoặc 5000 ms nếu muốn nhanh hơn
    console.log("Khởi tạo trang thành công");
  } catch (error) {
    console.error("Lỗi khi khởi tạo trang:", error);
    document.getElementById("loadingSpinner").style.display = "none";
    alert("Không thể tải dữ liệu. Vui lòng thử lại.");
  }
}

// // Xử lý nút tiếp tục
// document.getElementById("continueBtn").addEventListener("click", function () {
//   if (selectedSeats.length > 0) {
//     const bookingData = {
//       movie: movieData,
//       room: roomData,
//       selectedSeats: selectedSeats,
//       totalPrice: document.getElementById("totalPrice").textContent,
//       timestamp: new Date().toISOString(),
//     };

//     // Lưu thông tin vào localStorage để sử dụng ở trang thanh toán
//     try {
//       localStorage.setItem("bookingData", JSON.stringify(bookingData));
//       console.log("Đã lưu thông tin đặt vé:", bookingData);

//       // Xóa dữ liệu booking cũ
//       cleanupBookingData();
//     } catch (error) {
//       console.error("Lỗi khi lưu thông tin đặt vé:", error);
//     }

//     alert(
//       `Đã chọn ${selectedSeats.length} ghế: ${selectedSeats.join(
//         ", "
//       )}\nTổng tiền: ${
//         bookingData.totalPrice
//       } VND\n\nChuyển đến trang thanh toán...`
//     );

//     // Chuyển hướng đến trang thanh toán
//     window.location.href = "/html/food.html"; // Thay đổi đường dẫn theo cấu trúc thực tế
//   }
// });

document
  .getElementById("continueBtn")
  .addEventListener("click", async function () {
    if (selectedSeats.length > 0) {
      try {
        let token = sessionStorage.getItem("authToken");

        const continueBtn = document.getElementById("continueBtn");
        const originalText = continueBtn.textContent;
        continueBtn.textContent = "Đang xử lý...";
        continueBtn.disabled = true;

        // Chuyển đổi ngày từ dạng "Th 7, 08/06/2024" sang "2024-06-08"
        const convertToLocalDate = (dateStr) => {
          const datePart = dateStr.split(", ")[1]; // Lấy "08/06/2024"
          const [day, month, year] = datePart.split("/");
          return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
        };

        const response = await fetch("/api/booking/giuGhe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            idPhim: movieData.movieId,
            idPhong: roomData.idPhong,
            selectedSeats: selectedSeats,
            totalPrice: document
              .getElementById("totalPrice")
              .textContent.replace(/[^\d]/g, ""),
            bookingDate: convertToLocalDate(movieData.date),
            showTime: movieData.time,
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log("Giữ ghế thành công:", result);

        const bookingResult = result.result;

        // ✅ Tạo đối tượng bookingData kết hợp với movie title và date
        const bookingData = {
          ...bookingResult,
          movieTitle: movieData.title,
          movieCinema: movieData.cinema,
          movieDate: movieData.date,
          movieTime: movieData.time,
          room: roomData,
        };

        // ✅ Lưu vào localStorage để sử dụng sau này
        localStorage.setItem("bookingData", JSON.stringify(bookingData));

        alert(
          `Đã chọn ${
            bookingData.selectedSeats.length
          } ghế: ${bookingData.selectedSeats.join(", ")}\n` +
            `Tổng tiền: ${bookingData.totalPrice} VND\n\nChuyển đến trang chọn đồ ăn...`
        );

        // Chuyển đến trang tiếp theo
        window.location.href = "/html/food.html";
      } catch (error) {
        console.error("Lỗi khi giữ ghế:", error);
        alert("Có lỗi xảy ra khi giữ ghế. Vui lòng thử lại!");
        document.getElementById("continueBtn").textContent = originalText;
        document.getElementById("continueBtn").disabled = false;
      }
    } else {
      alert("Vui lòng chọn ít nhất một ghế!");
    }
  });

function debugLocalStorage() {
  console.log("=== DEBUG LOCALSTORAGE ===");
  console.log("selectedMovieData:", localStorage.getItem("selectedMovieData"));
  console.log("bookingData:", localStorage.getItem("bookingData"));
  console.log(
    "bookingInfo (sessionStorage):",
    sessionStorage.getItem("bookingInfo")
  );
  console.log("=========================");
}
// Khởi tạo khi trang được tải
window.addEventListener("load", initializePage);

// Xử lý lỗi global
window.addEventListener("error", function (event) {
  console.error("Lỗi JavaScript:", event.error);
});

// Debug: Log localStorage khi trang load
window.addEventListener("load", function () {
  console.log("Tất cả dữ liệu trong localStorage:");
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    console.log(`${key}: ${value}`);
  }
});
window.addEventListener("load", function () {
  debugLocalStorage();
});
//check login
document.addEventListener("DOMContentLoaded", function () {
  console.log("sessionStorage content!", sessionStorage);
  const token = sessionStorage.getItem("authToken");

  if (token) {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user) {
      if (user.avatar_url) {
        document.getElementById("user-avatar").src = user.avatar_url;
      }
    }
  } else {
    alert("Bạn chưa đăng nhập, vui lòng đăng nhập trước khi truy cập trang");
    window.location.href = "/html/trangchu.html";
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

// document.addEventListener("DOMContentLoaded", function () {
//   const navBrand = document.querySelector(".nav-brand");

//   if (navBrand) {
//     navBrand.addEventListener("click", function () {
//       localStorage.clear(); // Xoá toàn bộ localStorage
//     });
//   }
// });
