// Hàm format số tiền
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
}

// Hàm hiển thị thông tin đơn hàng
function displayOrderInfo() {
  try {
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status"); // Trạng thái: success, failed, invalid_signature, error
    const orderId = urlParams.get("orderId"); // Mã đơn hàng
    const amount = urlParams.get("amount"); // Số tiền (đơn vị xu từ VNPAY)
    const tickIcon = document.getElementById("tickIcon");
    const headerSection = document.getElementById("headerSection");
    const headerTitle = document.getElementById("headerTitle");
    const headerMessage = document.getElementById("headerMessage");
    const idticket = document.getElementById("id-ticket");

    if (status === "failed") {
      tickIcon.textContent = "X";
      tickIcon.classList.add("failed");
      headerSection.classList.add("failed");
      headerTitle.textContent = "Thanh Toán Thất Bại";
      headerMessage.textContent = "Giao dịch thất bại!!";
      // Optionally hide order details or show a different message for failed
      document.querySelector(".order-details").style.display = "none";
      document.querySelector(".total-section").style.display = "none";
      document.querySelector(".annouce").style.display = "none";
    } else {
      // Default to success if status is not 'failed' or is 'success'
      tickIcon.textContent = "✓";
      // No need to add success classes as they are default in CSS
    }

    const orderData = JSON.parse(localStorage.getItem("orderData"));

    if (orderData) {
      document.getElementById("id-ticket").textContent = orderId || "N/A";
      document.getElementById("movie-name").textContent = orderData.movie;
      document.getElementById("cinema-name").textContent = orderData.cinema;
      document.getElementById("date-time").textContent = orderData.date;
      document.getElementById("room-name").textContent = orderData.room;
      document.getElementById("selected-seats").textContent = orderData.seat;
      document.getElementById("payment-method").textContent =
        orderData.paymentMethod;
      document.getElementById("grand-total").textContent = amount
        ? (parseInt(amount) / 100).toLocaleString("vi-VN") + " VND"
        : "N/A";
    } else if (status !== "failed") {
      // Only show alert if it's not a 'failed' status and data is missing
      alert("Không tìm thấy thông tin đơn hàng!");
      goToHomePage();
    }
  } catch (error) {
    console.error("Lỗi khi đọc dữ liệu đơn hàng:", error);
    if (status !== "failed") {
      // Only show alert if it's not a 'failed' status and an error occurs
      alert("Có lỗi xảy ra khi tải thông tin đơn hàng!");
      goToHomePage();
    }
  }
}

// Hàm chuyển về trang chủ
function goToHomePage() {
  window.location.href = "trangchu.html";
}

// Gọi hàm hiển thị thông tin khi trang load
window.onload = function () {
  displayOrderInfo();
};
