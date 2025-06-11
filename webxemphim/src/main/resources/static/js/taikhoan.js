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
  });
});

// Profile form submission
document.getElementById("profileForm").addEventListener("submit", function (e) {
  e.preventDefault();

  // Get form data
  const formData = new FormData(this);
  const data = Object.fromEntries(formData);

  // Simulate API call
  setTimeout(() => {
    showNotification(
      "Thông tin cá nhân đã được cập nhật thành công!",
      "success"
    );

    // Update profile display
    document.querySelector(".profile-name").textContent =
      data.firstName + " " + data.lastName;
    document.querySelector(".profile-email").textContent = data.email;
  }, 1000);
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

function uploadAvatar() {
  const file = document.getElementById("avatarInput").files[0];
  if (!file) {
    showNotification("Vui lòng chọn ảnh để tải lên!", "error");
    return;
  }

  // Simulate upload
  setTimeout(() => {
    showNotification("Ảnh đại diện đã được cập nhật thành công!", "success");
    closeModal("avatarModal");
  }, 1500);
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

// Booking actions
document.querySelectorAll(".booking-item .btn-secondary").forEach((btn) => {
  btn.addEventListener("click", function () {
    const action = this.textContent.trim();
    if (action === "Xem chi tiết") {
      window.location.href = "/html/chitietdatve.html";
      showNotification("Đang chuyển đến trang chi tiết đặt vé...", "success");
    } else if (action === "Hủy vé") {
      if (confirm("Bạn có chắc chắn muốn hủy vé này?")) {
        showNotification("Yêu cầu hủy vé đã được gửi thành công!", "success");
        this.closest(".booking-item").querySelector(
          ".booking-status"
        ).textContent = "Đã hủy";
        this.closest(".booking-item").querySelector(
          ".booking-status"
        ).className = "booking-status status-cancelled";
        this.style.display = "none";
      }
    }
  });
});

// Initialize page
document.addEventListener("DOMContentLoaded", function () {
  // Show welcome notification
  setTimeout(() => {
    showNotification("Chào mừng bạn đến với trang tài khoản!", "success");
  }, 1000);
});
