/// Load user data from sessionStorage
function loadUserData() {
  try {
    // Get user data from sessionStorage
    const user = JSON.parse(sessionStorage.getItem("user"));
    const token = sessionStorage.getItem("authToken");

    if (user) {
      // Update profile header
      document.getElementById("profileName").textContent =
        user.hoten || "Chưa cập nhật";
      document.getElementById("profileEmail").textContent =
        user.email || "Chưa cập nhật";

      // Update avatar if available
      if (user.avatar_url) {
        document.getElementById("profileAvatar").src = user.avatar_url;
        document.getElementById("user-avatar").src = user.avatar_url;
      }

      // Split full name into first and last name
      const fullName = user.hoten || "";
      const nameParts = fullName.trim().split(" ");
      let firstName = "";
      let lastName = "";

      if (nameParts.length > 1) {
        lastName = nameParts[nameParts.length - 1];
        firstName = nameParts.slice(0, -1).join(" ");
      } else {
        firstName = fullName;
      }

      // Update form fields
      document.getElementById("firstName").value = firstName;
      document.getElementById("lastName").value = lastName;
      document.getElementById("email").value = user.email || "";
      document.getElementById("phone").value = user.sdt || "";

      // Handle birth date
      if (user.ngaysinh) {
        document.getElementById("birthDate").value = user.ngaysinh;
      }

      // Handle gender
      if (user.gioitinh) {
        document.getElementById("gender").value = user.gioitinh;
      }

      console.log("User data loaded successfully:", user);
    } else {
      console.log("No user data found in sessionStorage");
      showNotification(
        "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
        "error"
      );
      // Optionally redirect to login page
      // window.location.href = '/login.html';
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    showNotification("Lỗi khi tải thông tin người dùng.", "error");
  }
}

// Global variable to store booking data
let bookingsData = [];

// Load booking history from API
async function loadBookingHistory() {
  try {
    const token = sessionStorage.getItem("authToken");

    if (!token) {
      console.log("No auth token found");
      return;
    }

    const response = await fetch("http://localhost:8080/api/ticket/lich-su", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const bookingData = await response.json();
    console.log("Booking history loaded:", bookingData);

    // Store booking data globally
    bookingsData = bookingData;

    // Update the booking history section
    displayBookingHistory(bookingData);
  } catch (error) {
    console.error("Error loading booking history:", error);
    showNotification("Lỗi khi tải lịch sử đặt vé.", "error");

    // Show empty state or default message
    const bookingHistoryContainer = document.querySelector(".booking-history");
    bookingHistoryContainer.innerHTML = `
      <div class="empty-bookings">
        <i class="fas fa-ticket-alt" style="font-size: 48px; color: #666; margin-bottom: 16px;"></i>
        <p>Không thể tải lịch sử đặt vé. Vui lòng thử lại sau.</p>
      </div>
    `;
  }
}

// Display booking history
function displayBookingHistory(bookings) {
  const bookingHistoryContainer = document.querySelector(".booking-history");

  if (!bookings || bookings.length === 0) {
    bookingHistoryContainer.innerHTML = `
      <div class="empty-bookings">
        <i class="fas fa-ticket-alt" style="font-size: 48px; color: #666; margin-bottom: 16px;"></i>
        <p style="color:rgb(206, 206, 206)">Bạn chưa có lịch sử đặt vé nào.</p>
      </div>
    `;
    return;
  }

  // Clear existing content
  bookingHistoryContainer.innerHTML = "";

  // Create booking items
  bookings.forEach((booking, index) => {
    const bookingItem = createBookingItem(booking, index);
    bookingHistoryContainer.appendChild(bookingItem);
  });
}

// Create individual booking item
function createBookingItem(booking, index) {
  const bookingDiv = document.createElement("div");
  bookingDiv.className = "booking-item";

  // Format date
  const bookingDate = new Date(booking.ngayDat);
  const formattedDate = bookingDate.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const formattedTime = bookingDate.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Format price
  const formattedPrice = new Intl.NumberFormat("vi-VN").format(
    booking.tongGiaTriDonHang
  );

  // Determine status class and button
  let statusClass = "status-confirmed";
  let statusText = booking.trangthai;
  let actionButton = "";

  switch (booking.trangthai.toLowerCase()) {
    case "đã thanh toán":
      statusClass = "status-confirmed";
      actionButton =
        '<button class="btn-secondary" onclick="viewBookingDetail(' +
        index +
        ')">Xem chi tiết</button>';
      break;
    case "chờ xác nhận":
      statusClass = "status-pending";
      actionButton =
        '<button class="btn-secondary" onclick="cancelBooking(' +
        index +
        ')">Hủy vé</button>';
      break;
    case "đã hủy":
      statusClass = "status-cancelled";
      actionButton = "";
      break;
    default:
      statusClass = "status-confirmed";
      actionButton =
        '<button class="btn-secondary" onclick="viewBookingDetail(' +
        index +
        ')">Xem chi tiết</button>';
  }

  bookingDiv.innerHTML = `
    <img
      src="${booking.url_poster}"
      alt="Movie Poster"
      class="movie-poster"
      onerror="this.src='/images/default-movie-poster.jpg'"
    />
    <div class="booking-info">
      <h3>${booking.tenphim}</h3>
      <div class="booking-details">
        <i class="fas fa-calendar"></i> ${formattedDate} - ${formattedTime}
      </div>
      <div class="booking-details">
        <i class="fas fa-chair"></i> Ghế: ${booking.danhSachGhe}
      </div>
      <div class="booking-details">
        <i class="fas fa-credit-card"></i> Tổng: ${formattedPrice} VNĐ
      </div>
    </div>
    <div class="booking-actions">
      <span class="booking-status ${statusClass}">${statusText}</span>
      ${actionButton}
    </div>
  `;

  return bookingDiv;
}

// View booking detail function - Updated to redirect with idve
function viewBookingDetail(index) {
  try {
    // Get the booking data from the stored array
    const booking = bookingsData[index];

    if (!booking) {
      showNotification("Không tìm thấy thông tin vé.", "error");
      return;
    }

    // Get the ticket ID from the booking object
    const ticketId = booking.idVe;

    if (!ticketId) {
      showNotification("Không tìm thấy ID vé.", "error");
      console.error("Booking data:", booking);
      return;
    }

    // Show loading notification
    showNotification("Đang chuyển đến trang chi tiết đặt vé...", "success");

    // Redirect to chitietdatve page with idve parameter
    setTimeout(() => {
      window.location.href = `/html/chitietdatve.html?idve=${ticketId}`;
    }, 500);
  } catch (error) {
    console.error("Error viewing booking detail:", error);
    showNotification("Có lỗi xảy ra khi xem chi tiết vé.", "error");
  }
}

// Cancel booking function
function cancelBooking(index) {
  if (confirm("Bạn có chắc chắn muốn hủy vé này?")) {
    // Here you would typically call an API to cancel the booking
    // For now, we'll just show a success message
    showNotification("Yêu cầu hủy vé đã được gửi thành công!", "success");

    // Optionally reload the booking history
    // loadBookingHistory();
  }
}

// Menu navigation
document.querySelectorAll(".menu-item").forEach((item) => {
  item.addEventListener("click", function (e) {
    e.preventDefault();

    // Remove active class from all menu items
    document.querySelectorAll(".menu-item").forEach((menu) => {
      menu.classList.remove("active");
    });

    // Add active class to clicked item
    this.classList.add("active");

    // Hide all content sections
    document.querySelectorAll(".content-section").forEach((section) => {
      section.classList.remove("active");
    });

    // Show selected section
    const sectionId = this.getAttribute("data-section");
    document.getElementById(sectionId).classList.add("active");

    // Load booking history when bookings section is selected
    if (sectionId === "bookings") {
      loadBookingHistory();
    }
  });
});

// Profile form submission
document
  .getElementById("profileForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Đang cập nhật...";
    submitBtn.disabled = true;
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);

    // Get current user data and token from sessionStorage
    let user, token;
    try {
      user = JSON.parse(sessionStorage.getItem("user"));
      token = sessionStorage.getItem("authToken");

      if (!user || !token) {
        showNotification(
          "Không tìm thấy thông tin đăng nhập. Vui lòng đăng nhập lại.",
          "error"
        );
        return;
      }
    } catch (error) {
      console.error("Error getting user data from sessionStorage:", error);
      showNotification("Lỗi khi lấy thông tin người dùng.", "error");
      return;
    }

    // Prepare update data
    const updateData = {
      idUser: user.idUser,
      hoten: data.firstName.trim() + " " + data.lastName.trim(),
      sdt: data.phone,
      ngaysinh: data.birthDate || null,
      gioitinh: data.gender || null,
    };

    try {
      // Call API to update user profile
      const response = await fetch(
        "http://localhost:8080/api/khachhang/update-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      const result = await response.json();

      if (response.ok && result.code === 1000) {
        // Update successful
        showNotification(
          "Thông tin cá nhân đã được cập nhật thành công!",
          "success"
        );

        // Update user data in sessionStorage with response data
        const updatedUser = { ...user, ...result.result };
        sessionStorage.setItem("user", JSON.stringify(updatedUser));

        // Update profile display elements
        document.getElementById("profileName").textContent =
          updatedUser.hoten || "Chưa cập nhật";
        document.getElementById("profileEmail").textContent =
          updatedUser.email || "Chưa cập nhật";

        // Update other profile display elements if they exist
        const profileNameElement = document.querySelector(".profile-name");
        const profileEmailElement = document.querySelector(".profile-email");

        if (profileNameElement) {
          profileNameElement.textContent = updatedUser.hoten;
        }
        if (profileEmailElement) {
          profileEmailElement.textContent = updatedUser.email;
        }

        console.log("Profile updated successfully:", updatedUser);
      } else {
        // Handle API error
        const errorMessage =
          result.message || "Có lỗi xảy ra khi cập nhật thông tin.";
        showNotification(errorMessage, "error");
        console.error("API Error:", result);
      }
    } catch (error) {
      console.error("Error updating profile:", error);

      // Check if it's a network error
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        showNotification(
          "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối và thử lại.",
          "error"
        );
      } else {
        showNotification(
          "Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.",
          "error"
        );
      }
    } finally {
      // Restore button state
      const submitBtn = this.querySelector('button[type="submit"]');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

// Change password form
document
  .getElementById("changePasswordForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const currentPassword = document.getElementById("currentPassword").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validate passwords
    if (newPassword !== confirmPassword) {
      showNotification("Mật khẩu xác nhận không khớp!", "error");
      return;
    }

    if (newPassword.length < 6) {
      showNotification("Mật khẩu phải có ít nhất 6 ký tự!", "error");
      return;
    }

    // Simulate API call
    setTimeout(() => {
      showNotification("Mật khẩu đã được thay đổi thành công!", "success");
      closeModal("changePasswordModal");
      this.reset();
    }, 1000);
  });

// Toggle switches
document.querySelectorAll(".toggle-switch").forEach((toggle) => {
  toggle.addEventListener("click", function () {
    this.classList.toggle("active");
    const setting = this.getAttribute("data-setting");
    const isActive = this.classList.contains("active");

    // Save setting (simulate API call)
    setTimeout(() => {
      showNotification(
        `Cài đặt ${setting} đã được ${isActive ? "bật" : "tắt"}!`,
        "success"
      );
    }, 500);
  });
});

// Avatar upload
document.getElementById("profileAvatar").addEventListener("click", function () {
  openModal("avatarModal");
});

document.getElementById("avatarInput").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("profileAvatar").src = e.target.result;
      document.querySelector(".user-avatar").src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Modal functions
function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

function openChangePasswordModal() {
  openModal("changePasswordModal");
}

//cập nhật avatar
async function uploadAvatar() {
  const fileInput = document.getElementById("avatarInput");
  const file = fileInput.files[0];

  if (!file) {
    showNotification("Vui lòng chọn ảnh để tải lên!", "error");
    return;
  }

  const token = sessionStorage.getItem("authToken");
  if (!token) {
    showNotification("Bạn chưa đăng nhập!", "error");
    return;
  }

  const formData = new FormData();
  formData.append("avatar", file);

  try {
    const response = await fetch("http://localhost:8080/api/auth/upAva", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        // KHÔNG thêm Content-Type vì browser sẽ tự gán multipart boundary
      },
      body: formData,
    });

    const data = await response.json();

    if (response.ok) {
      showNotification(data.message || "Cập nhật thành công!", "success");

      // Cập nhật ảnh trên giao diện
      if (data.result) {
        document.getElementById("profileAvatar").src = data.result;
        document.querySelector(".user-avatar").src = data.result;
      }
      // 👇 Cập nhật lại sessionStorage
      const user = JSON.parse(sessionStorage.getItem("user")) || {};
      user.avatar_url = data.result; // gán avatar mới
      sessionStorage.setItem("user", JSON.stringify(user));
      const avatarUrl = user.avatar_url + "?t=" + new Date().getTime();
      document.getElementById("profileAvatar").src = avatarUrl;
      document.getElementById("user-avatar").src = avatarUrl;

      closeModal("avatarModal");
    } else {
      showNotification(data.message || "Có lỗi xảy ra", "error");
    }
  } catch (err) {
    console.error("Lỗi khi upload:", err);
    showNotification("Không thể kết nối tới máy chủ", "error");
  }
}

// Notification function
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

// Close modal when clicking outside
window.addEventListener("click", function (e) {
  if (e.target.classList.contains("modal")) {
    e.target.style.display = "none";
  }
});

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  loadUserData();
  // Show welcome notification
  setTimeout(() => {
    showNotification("Chào mừng bạn đến với trang tài khoản!", "success");
  }, 1000);
});
