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

    const params = new URLSearchParams({
      tenphim: movieData.title || "",
      suat: movieData.time || "",
      ngay: formattedDate || "",
    });

    const response = await fetch(`http://localhost:8080/api/seat?${params}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Dữ liệu ghế đã đặt từ API:", data);

    if (!data || data.length === 0) {
      console.log("Tất cả ghế đều trống");
      return [];
    }

    // Convert từ {hang: "A", cot: 1} sang "A1"
    const occupiedSeatIds = data.map((seat) => `${seat.hang}${seat.cot}`);
    console.log("Ghế đã đặt (converted IDs):", occupiedSeatIds);

    return occupiedSeatIds;
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

    console.log("Khởi tạo trang thành công");
  } catch (error) {
    console.error("Lỗi khi khởi tạo trang:", error);
    document.getElementById("loadingSpinner").style.display = "none";
    alert("Không thể tải dữ liệu. Vui lòng thử lại.");
  }
}

// Xử lý nút tiếp tục
document.getElementById("continueBtn").addEventListener("click", function () {
  if (selectedSeats.length > 0) {
    const bookingData = {
      movie: movieData,
      room: roomData,
      selectedSeats: selectedSeats,
      totalPrice: document.getElementById("totalPrice").textContent,
      timestamp: new Date().toISOString(),
    };

    // Lưu thông tin vào localStorage để sử dụng ở trang thanh toán
    try {
      localStorage.setItem("bookingData", JSON.stringify(bookingData));
      console.log("Đã lưu thông tin đặt vé:", bookingData);

      // Xóa dữ liệu booking cũ
      cleanupBookingData();
    } catch (error) {
      console.error("Lỗi khi lưu thông tin đặt vé:", error);
    }

    alert(
      `Đã chọn ${selectedSeats.length} ghế: ${selectedSeats.join(
        ", "
      )}\nTổng tiền: ${
        bookingData.totalPrice
      } VND\n\nChuyển đến trang thanh toán...`
    );

    // Chuyển hướng đến trang thanh toán
    window.location.href = "/html/payment.html"; // Thay đổi đường dẫn theo cấu trúc thực tế
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
