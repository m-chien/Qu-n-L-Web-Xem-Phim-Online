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
  loadUserData();
  // Show welcome notification
  setTimeout(() => {
    showNotification("Chào mừng bạn đến với trang tài khoản!", "success");
  }, 1000);
});
