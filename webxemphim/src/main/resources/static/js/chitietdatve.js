// Global variable to store ticket data
let ticketData = null;

// Get ticket ID from URL parameter
function getTicketIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("idve");
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount) + " VNĐ";
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  const days = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];
  const dayName = days[date.getDay()];
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${dayName}, ${day}/${month}/${year}`;
}

// Format time
function formatTime(timeString) {
  return timeString.substring(0, 5); // Extract HH:MM from HH:MM:SS
}

// Format datetime for payment
function formatDateTime(dateTimeString) {
  const date = new Date(dateTimeString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

// Generate star rating HTML
function generateStarRating(rating) {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let starsHtml = "";

  // Full stars
  for (let i = 0; i < fullStars; i++) {
    starsHtml += '<i class="fas fa-star"></i>';
  }

  // Half star
  if (hasHalfStar) {
    starsHtml += '<i class="fas fa-star-half-alt"></i>';
  }

  // Empty stars
  for (let i = 0; i < emptyStars; i++) {
    starsHtml += '<i class="far fa-star"></i>';
  }

  return starsHtml;
}

// Update page with ticket data
function updatePageWithTicketData(data) {
  if (!data || !data.result || !data.result.veInfo) {
    console.error("❌ Dữ liệu không hợp lệ từ API:", data);
    showNotification("Dữ liệu trả về không đầy đủ. Vui lòng thử lại!", "error");
    return;
  }
  const result = data.result;

  // Update booking ID
  document.getElementById(
    "bookingId"
  ).textContent = `Mã đặt vé: #${result.veInfo.idVe}`;

  // Update movie information
  document.getElementById("moviePoster").src = result.phimInfo.urlPoster;
  document.getElementById("moviePoster").alt = result.phimInfo.tenPhim;
  const theloaiList = result.theloai.filter((t) => t !== null); // tránh null
  document.getElementById("movie-genre").textContent = theloaiList.join(" • ");
  document.getElementById("movieTitle").textContent = result.phimInfo.tenPhim;
  document.getElementById("movieDescription").textContent =
    result.phimInfo.moTa;

  // Update rating
  const avgRating = result.danhGia.diemDanhGiaTrungBinh;
  const reviewCount = result.danhGia.soLuotDanhGia;
  document.getElementById("ratingStars").innerHTML =
    generateStarRating(avgRating);
  document.getElementById(
    "ratingText"
  ).textContent = `${avgRating}/5 (${reviewCount} đánh giá)`;

  // Update show information
  document.getElementById("showDate").textContent = formatDate(
    result.lichChieu.ngayChieu
  );
  document.getElementById("showTime").textContent = formatTime(
    result.lichChieu.tgianChieu
  );
  document.getElementById(
    "duration"
  ).textContent = `${result.phimInfo.thoiLuong} phút`;
  document.getElementById("room").textContent = `${result.phong}`;

  // Update booking status
  const statusElement = document.getElementById("bookingStatus");
  const status = result.veInfo.trangThai;
  let statusClass = "status-confirmed";
  let statusIcon = "fas fa-check-circle";

  if (status === "Đã hủy") {
    statusClass = "status-cancelled";
    statusIcon = "fas fa-times-circle";
  } else if (status === "Chờ thanh toán") {
    statusClass = "status-pending";
    statusIcon = "fas fa-clock";
  }

  statusElement.className = `status-badge ${statusClass}`;
  statusElement.innerHTML = `<i class="${statusIcon}"></i> ${status}`;

  // Update seats
  const seatsContainer = document.getElementById("seatsContainer");
  seatsContainer.innerHTML = "";
  result.danhSachGhe.forEach((seat) => {
    const seatElement = document.createElement("div");
    seatElement.className = "seat";
    seatElement.textContent = seat;
    seatsContainer.appendChild(seatElement);
  });

  // Update payment information
  document.getElementById("ticketPrice").textContent = formatCurrency(
    result.veInfo.tienVe
  );
  document.getElementById("foodPrice").textContent = formatCurrency(
    result.veInfo.tienDoAn
  );
  document.getElementById("totalPrice").textContent = formatCurrency(
    result.veInfo.tongTien
  );

  // Update payment method
  const paymentMethod =
    result.thanhToan.phuongThucThanhToan === "online"
      ? "Thanh toán online"
      : "Thanh toán tại quầy";
  document.getElementById("paymentMethod").textContent = paymentMethod;
  document.getElementById("paymentTime").textContent = formatDateTime(
    result.thanhToan.ngayThanhToan
  );

  // Store data globally for other functions
  ticketData = result;
}

// Fetch ticket details from API
async function fetchTicketDetails(ticketId) {
  const loadingOverlay = document.getElementById("loadingOverlay");
  loadingOverlay.style.display = "flex";

  try {
    const response = await fetch(
      `http://localhost:8080/api/ve/chi-tiet/${ticketId}`
    );
    const data = await response.json();

    if (data.code === 1000) {
      updatePageWithTicketData(data);
      showNotification("Đã tải thông tin vé thành công!", "success");
    } else {
      throw new Error(data.message || "Có lỗi xảy ra khi tải dữ liệu");
    }
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    showNotification("Không thể tải thông tin vé. Vui lòng thử lại!", "error");
  } finally {
    loadingOverlay.style.display = "none";
  }
}

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  const ticketId = getTicketIdFromUrl();

  if (!ticketId) {
    showNotification("Không tìm thấy mã vé. Vui lòng thử lại!", "error");
    setTimeout(() => {
      window.location.href = "/html/taikhoan.html";
    }, 2000);
    return;
  }

  // Fetch ticket details
  fetchTicketDetails(ticketId);

  // Animate cards on scroll
  const cards = document.querySelectorAll(".detail-card");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.transform = "translateY(0)";
        entry.target.style.opacity = "1";
      }
    });
  });

  cards.forEach((card) => {
    card.style.transform = "translateY(20px)";
    card.style.opacity = "0";
    card.style.transition = "all 0.6s ease";
    observer.observe(card);
  });
});

// Show notification
function showNotification(message, type = "success") {
  const notification = document.getElementById("notification");
  const notificationText = document.getElementById("notificationText");

  notificationText.textContent = message;
  notification.className = `notification ${type}`;
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// Download ticket
function downloadTicket() {
  showNotification("Đang tải vé PDF...");
  // Simulate download
  setTimeout(() => {
    showNotification("Vé đã được tải thành công!");
  }, 2000);
}

// Share ticket
function shareTicket() {
  if (navigator.share) {
    const movieTitle = ticketData ? ticketData.phimInfo.tenPhim : "phim";
    navigator.share({
      title: `Vé xem phim ${movieTitle}`,
      text: `Tôi vừa đặt vé xem phim ${movieTitle} tại CGV Vincom Center`,
      url: window.location.href,
    });
  } else {
    // Fallback for browsers that don't support Web Share API
    navigator.clipboard.writeText(window.location.href).then(() => {
      showNotification("Đã sao chép link vé vào clipboard!");
    });
  }
}

// Add to calendar
function addToCalendar() {
  if (!ticketData) {
    showNotification("Chưa có thông tin vé để thêm vào lịch!", "error");
    return;
  }

  const movieTitle = ticketData.phimInfo.tenPhim;
  const showDate = ticketData.lichChieu.ngayChieu;
  const showTime = ticketData.lichChieu.tgianChieu;
  const duration = ticketData.phimInfo.thoiLuong;
  const seats = ticketData.danhSachGhe.join(", ");
  const phongdat = ticketData.phong;

  // Calculate end time
  const startDateTime = new Date(`${showDate}T${showTime}`);
  const endDateTime = new Date(startDateTime.getTime() + duration * 60000);

  const formatDateForCalendar = (date) => {
    return date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  const eventDetails = {
    title: `Xem phim: ${movieTitle}`,
    start: formatDateForCalendar(startDateTime),
    end: formatDateForCalendar(endDateTime),
    description: `Xem phim tại GalaXy Đà Nẵng - ${phongdat} - Ghế ${seats}`,
    location: "478 Điện Biên Phủ, Quận Thanh Khê, TP. Đà Nẵng",
  };

  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
    eventDetails.title
  )}&dates=${eventDetails.start}/${
    eventDetails.end
  }&details=${encodeURIComponent(
    eventDetails.description
  )}&location=${encodeURIComponent(eventDetails.location)}`;

  window.open(googleCalendarUrl, "_blank");
  showNotification("Đã mở Google Calendar để thêm sự kiện!");
}

// Cancel ticket
function cancelTicket() {
  if (!ticketData) {
    showNotification("Chưa có thông tin vé để hủy!", "error");
    return;
  }

  if (ticketData.veInfo.trangThai === "Đã hủy") {
    showNotification("Vé này đã được hủy trước đó!", "warning");
    return;
  }

  if (
    confirm(
      "Bạn có chắc chắn muốn hủy vé này không? Hành động này không thể hoàn tác."
    )
  ) {
    showNotification("Đang xử lý yêu cầu hủy vé...", "warning");
    // Simulate cancellation process
    setTimeout(() => {
      showNotification(
        "Vé đã được hủy thành công. Tiền sẽ được hoàn trả trong 3-5 ngày làm việc.",
        "success"
      );
      // Update status
      setTimeout(() => {
        window.location.href = "/html/taikhoan.html";
      }, 2000);
    }, 3000);
  }
}
