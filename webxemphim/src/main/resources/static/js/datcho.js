// Dữ liệu mô phỏng
const movieData = {
  title: "Avengers: Endgame",
  date: "15/06/2025",
  time: "19:30",
  cinema: "CineMax Vincom",
  room: "Phòng 1",
};

const seatPrices = {
  normal: 100000,
  vip: 150000,
};

// Khởi tạo dữ liệu ghế
const totalRows = 10;
const seatsPerRow = 14;
let selectedSeats = [];
let occupiedSeats = [];

// Mô phỏng API call để lấy ghế đã đặt
async function fetchOccupiedSeats() {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mô phỏng dữ liệu ghế đã đặt
      const occupied = [
        "A3",
        "A4",
        "A5",
        "B7",
        "B8",
        "C1",
        "C2",
        "C12",
        "C13",
        "D5",
        "D6",
        "D9",
        "D10",
        "E3",
        "E4",
        "E11",
        "E12",
        "F6",
        "F7",
        "F8",
        "G2",
        "G3",
        "G12",
        "G13",
        "H1",
        "H14",
      ];
      resolve(occupied);
    }, 2000); // Mô phỏng delay 2 giây
  });
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
  occupiedSeatIds.forEach((seatId) => {
    const seatElement = document.querySelector(`[data-seat-id="${seatId}"]`);
    if (seatElement) {
      seatElement.classList.add("occupied");
      seatElement.classList.remove("available", "vip");
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

// Khởi tạo trang
async function initializePage() {
  // Hiển thị thông tin phim
  document.getElementById("movieTitle").textContent = movieData.title;
  document.getElementById("selectedDate").textContent = movieData.date;
  document.getElementById("selectedTime").textContent = movieData.time;
  document.getElementById("cinemaName").textContent = movieData.cinema;
  document.getElementById("roomName").textContent = movieData.room;

  // Tạo layout ghế
  createSeatsLayout();

  try {
    // Lấy dữ liệu ghế đã đặt từ API
    occupiedSeats = await fetchOccupiedSeats();

    // Ẩn loading và hiển thị ghế
    document.getElementById("loadingSpinner").style.display = "none";
    document.getElementById("seatsContainer").style.display = "flex";

    // Đánh dấu ghế đã đặt và ghế có sẵn
    markOccupiedSeats(occupiedSeats);
    markAvailableSeats();
  } catch (error) {
    console.error("Lỗi khi tải dữ liệu ghế:", error);
    alert("Không thể tải dữ liệu ghế. Vui lòng thử lại.");
  }
}

// Xử lý nút tiếp tục
document.getElementById("continueBtn").addEventListener("click", function () {
  if (selectedSeats.length > 0) {
    const bookingData = {
      movie: movieData,
      selectedSeats: selectedSeats,
      totalPrice: document.getElementById("totalPrice").textContent,
    };

    // Lưu thông tin vào memory (thay vì localStorage)
    window.bookingData = bookingData;

    alert(
      `Đã chọn ${selectedSeats.length} ghế: ${selectedSeats.join(
        ", "
      )}\nTổng tiền: ${
        bookingData.totalPrice
      } VND\n\nChuyển đến trang thanh toán...`
    );

    // Ở đây bạn có thể chuyển hướng đến trang thanh toán
    // window.location.href = '/payment';
  }
});

// Khởi tạo khi trang được tải
window.addEventListener("load", initializePage);
