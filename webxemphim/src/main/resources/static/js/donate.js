let selectedAmount = 0;

// Xử lý click chọn số tiền cố định
document.querySelectorAll(".amount-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    // Xóa active từ tất cả buttons
    document
      .querySelectorAll(".amount-btn")
      .forEach((b) => b.classList.remove("active"));

    // Thêm active cho button hiện tại
    this.classList.add("active");

    // Lưu số tiền được chọn
    selectedAmount = parseInt(this.dataset.amount);

    // Xóa giá trị input custom
    document.querySelector(".custom-input").value = "";
  });
});

// Xử lý input số tiền tùy chỉnh
document.querySelector(".custom-input").addEventListener("input", function () {
  const customAmount = parseInt(this.value);

  if (customAmount && customAmount >= 1000) {
    selectedAmount = customAmount;

    // Xóa active từ tất cả buttons
    document
      .querySelectorAll(".amount-btn")
      .forEach((b) => b.classList.remove("active"));
  } else {
    selectedAmount = 0;
  }
});

// Hàm tạo QR code
function generateQR() {
  if (selectedAmount <= 0) {
    alert("Vui lòng chọn số tiền bạn muốn ủng hộ!");
    return;
  }

  if (selectedAmount < 1000) {
    alert("Số tiền tối thiểu là 1,000₫");
    return;
  }

  // Tạo URL QR với số tiền đã chọn
  const qrUrl = `https://img.vietqr.io/image/MB-0969827284-compact2.png?amount=${selectedAmount}&addInfo=donate%20mchien&accountName=tran%20minh%20chien`;

  // Cập nhật hình ảnh QR
  document.getElementById("qrImage").src = qrUrl;

  // Hiển thị số tiền
  document.getElementById(
    "amountDisplay"
  ).textContent = `Số tiền: ${selectedAmount.toLocaleString("vi-VN")}₫`;

  // Ẩn form và hiện QR
  document.getElementById("donateForm").style.display = "none";
  document.getElementById("qrSection").classList.add("show");
}

// Hàm quay lại
function goBack() {
  document.getElementById("qrSection").classList.remove("show");
  document.getElementById("donateForm").style.display = "block";
}

// Thêm hiệu ứng hover cho các nút
document.querySelectorAll(".amount-btn").forEach((btn) => {
  btn.addEventListener("mouseenter", function () {
    if (!this.classList.contains("active")) {
      this.style.transform = "translateY(-3px)";
    }
  });

  btn.addEventListener("mouseleave", function () {
    if (!this.classList.contains("active")) {
      this.style.transform = "translateY(0)";
    }
  });
});

// Format số tiền khi nhập
document.querySelector(".custom-input").addEventListener("input", function () {
  let value = this.value.replace(/\D/g, "");
  if (value) {
    this.value = parseInt(value);
  }
});

// Mobile menu toggle functionality
document
  .getElementById("mobileMenuToggle")
  .addEventListener("click", function () {
    const mobileMenu = document.getElementById("mobileMenu");
    mobileMenu.classList.toggle("show");
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
