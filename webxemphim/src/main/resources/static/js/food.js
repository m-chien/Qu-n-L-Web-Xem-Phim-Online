// Configuration
const API_BASE_URL = "http://localhost:8080/api";
const FOOD_API_ENDPOINT = `${API_BASE_URL}/Food`;

let foodItems = [];
let cart = [];
// XÓa BỎ hoặc comment dòng này để ticketPrice không còn là giá tĩnh
// const ticketPrice = 95000;
let dynamicTicketPrice = 0; // Thêm biến này để lưu giá vé động từ localStorage
let countdownInterval = null;
let remainingTime = 0; // Thời gian còn lại tính bằng giây

async function loadRemainingTime() {
  try {
    let token = sessionStorage.getItem("authToken");
    // Lấy idlichchieu từ localStorage (giả sử có trong bookingData)
    const bookingDataJSON = localStorage.getItem("bookingData");
    let idlichchieu; // Default value

    if (bookingDataJSON) {
      const bookingData = JSON.parse(bookingDataJSON);
      idlichchieu = bookingData.idlichchieu;
    }

    const response = await fetch(
      `http://localhost:8080/api/booking/remainTime?idlichchieu=${idlichchieu}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const remainingMilliseconds = await response.json(); // Vì backend trả Long
    const seconds = Math.max(0, Math.floor(remainingMilliseconds));

    remainingTime = seconds;
    startCountdown();
  } catch (error) {
    console.error("Error loading remaining time:", error);
    // Hiển thị thông báo lỗi
    document.getElementById("ttl-remain").innerHTML = `
      <div style="color: #dc3545; padding: 10px; text-align: center; border: 1px solid #dc3545; border-radius: 5px; background: rgba(220, 53, 69, 0.1);">
        <i class="fas fa-exclamation-triangle"></i> Không thể tải thời gian còn lại
      </div>
    `;
  }
}

// Hàm bắt đầu countdown
function startCountdown() {
  // Clear interval cũ nếu có
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  // Cập nhật hiển thị ngay lập tức
  updateCountdownDisplay();

  // Bắt đầu countdown
  countdownInterval = setInterval(() => {
    remainingTime--;

    if (remainingTime <= 0) {
      clearInterval(countdownInterval);
      handleTimeExpired();
    } else {
      updateCountdownDisplay();
    }
  }, 1000);
}

// Hàm cập nhật hiển thị countdown
function updateCountdownDisplay() {
  const ttlRemainElement = document.getElementById("ttl-remain");

  if (remainingTime <= 0) {
    ttlRemainElement.innerHTML = `
      <div style="color: #dc3545; padding: 15px; text-align: center; border: 2px solid #dc3545; border-radius: 10px; background: rgba(220, 53, 69, 0.1);">
        <i class="fas fa-clock" style="font-size: 1.5rem; margin-bottom: 5px;"></i>
        <div style="font-weight: bold; font-size: 1.1rem;">Hết thời gian giữ ghế!</div>
      </div>
    `;
    return;
  }

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  // Thay đổi màu sắc dựa trên thời gian còn lại
  let colorClass = "success";
  let bgColor = "rgba(40, 167, 69, 0.1)";
  let borderColor = "#28a745";

  if (remainingTime <= 60) {
    // Dưới 1 phút
    colorClass = "danger";
    bgColor = "rgba(220, 53, 69, 0.1)";
    borderColor = "#dc3545";
  } else if (remainingTime <= 300) {
    // Dưới 5 phút
    colorClass = "warning";
    bgColor = "rgba(255, 193, 7, 0.1)";
    borderColor = "#ffc107";
  }

  ttlRemainElement.innerHTML = `
    <div style="color: ${borderColor}; padding: 15px; text-align: center; border: 2px solid ${borderColor}; border-radius: 10px; background: ${bgColor};">
      <i class="fas fa-clock" style="font-size: 1.5rem; margin-bottom: 8px;"></i>
      <div style="font-weight: bold; font-size: 1.2rem; margin-bottom: 5px;">
        ${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}
      </div>
      <div style="font-size: 0.9rem; opacity: 0.8;">Thời gian giữ ghế</div>
    </div>
  `;
}

// Hàm xử lý khi hết thời gian
function handleTimeExpired() {
  alert("Thời gian giữ ghế đã hết! Bạn sẽ được chuyển về trang chọn ghế.");
  // Có thể chuyển hướng về trang chọn ghế hoặc trang chủ
  window.location.href = "/html/datcho.html"; // Thay đổi URL phù hợp
}

// Format currency
function formatCurrency(amount) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(amount)
    .replace("₫", "₫");
}

// Load food items from API
async function loadFoodItems() {
  try {
    // Show loading state
    document.getElementById("loading").style.display = "block";
    document.getElementById("error-message").style.display = "none";
    document.getElementById("food-grid").style.display = "none";

    // Make API call
    const response = await fetch(FOOD_API_ENDPOINT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if API response is successful
    if (data.code !== 1000) {
      throw new Error(data.message || "API response error");
    }

    // Map API data to our format
    foodItems = data.result.map((item) => ({
      id: item.idFood,
      name: item.tendoan,
      description: item.mota,
      price: item.giaban,
      status: item.trangthai,
      stock: item.soluonngtonkho,
      image: item.url_anh ? `http://localhost:8080${item.url_anh}` : null,
    }));

    // Filter only available items
    foodItems = foodItems.filter(
      (item) => item.status === "Còn hàng" && item.stock > 0
    );

    renderFoodItems();
    document.getElementById("loading").style.display = "none";
    document.getElementById("food-grid").style.display = "grid";

    console.log(`Loaded ${foodItems.length} food items successfully`);
  } catch (error) {
    console.error("Error loading food items:", error);
    document.getElementById("loading").style.display = "none";
    document.getElementById("error-message").style.display = "block";

    // Show user-friendly error message
    const errorDiv = document.getElementById("error-message");
    errorDiv.innerHTML = `
                <div style="text-align: center; padding: 20px;">
                  <p style="color: red; font-weight: bold;">❌ Không thể tải danh sách sản phẩm</p>
                  <p style="color: #666; font-size: 0.9rem;">
                    ${
                      error.message.includes("fetch")
                        ? "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng."
                        : error.message
                    }
                  </p>
                  <button onclick="loadFoodItems()" class="retry-btn" style="
                    background: #ff6b35;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-weight: bold;
                    margin-top: 10px;
                  ">🔄 Thử lại</button>
                </div>
              `;
  }
}

// Render food items
function renderFoodItems() {
  const foodGrid = document.getElementById("food-grid");
  foodGrid.innerHTML = "";

  if (foodItems.length === 0) {
    foodGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                  <h3>🍿 Hiện tại không có sản phẩm nào</h3>
                  <p style="color: #666;">Vui lòng quay lại sau hoặc bỏ qua bước này.</p>
                </div>
              `;
    return;
  }

  foodItems.forEach((item) => {
    const cartItem = cart.find((c) => c.id === item.id);
    const quantity = cartItem ? cartItem.quantity : 0;

    const foodItemElement = document.createElement("div");
    foodItemElement.className = `food-item ${quantity > 0 ? "selected" : ""}`;

    // Handle image with fallback
    const imageUrl = item.image || getDefaultImage();

    foodItemElement.innerHTML = `
                <img src="${imageUrl}" alt="${item.name}" class="food-image" 
                     onerror="this.src='${getDefaultImage()}'">
                <div class="food-content">
                  <div class="food-name">${item.name}</div>
                  <div class="food-description">${item.description}</div>
                  <div class="food-price">${formatCurrency(item.price)}</div>
                  <div class="food-stock">Còn lại: ${item.stock}</div>
                  <div class="quantity-control">
                    <div class="quantity-buttons">
                      <button class="btn" onclick="decreaseQuantity('${
                        item.id
                      }')" ${quantity === 0 ? "disabled" : ""}>−</button>
                      <span class="quantity">${quantity}</span>
                      <button class="btn" onclick="increaseQuantity('${
                        item.id
                      }')" ${
      quantity >= item.stock ? "disabled" : ""
    }>+</button>
                    </div>
                  </div>
                </div>
              `;
    foodGrid.appendChild(foodItemElement);
  });
}

// Get default image for fallback
function getDefaultImage() {
  return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFuaCBrbsO0bmcgdOG6o2k8L3RleHQ+PC9zdmc+";
}

// Increase quantity
function increaseQuantity(itemId) {
  const item = foodItems.find((f) => f.id === itemId);
  const cartItem = cart.find((c) => c.id === itemId);

  if (!item) return;

  const currentQuantity = cartItem ? cartItem.quantity : 0;

  // Check stock limit
  if (currentQuantity >= item.stock) {
    showNotification(`Không thể thêm ${item.name}. Đã hết hàng!`, "error");
    return;
  }

  if (cartItem) {
    cartItem.quantity++;
    showNotification(`Đã tăng ${item.name} (${cartItem.quantity})`);
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image || getDefaultImage(),
      quantity: 1,
    });
    showNotification(`Đã thêm ${item.name} vào giỏ hàng`);
  }

  updateCart();
  renderFoodItems();
  updateBookingFoodList();
}

// Decrease quantity
function decreaseQuantity(itemId) {
  const cartItem = cart.find((c) => c.id === itemId);

  if (cartItem) {
    const item = foodItems.find((f) => f.id === itemId);
    cartItem.quantity--;
    if (cartItem.quantity === 0) {
      cart = cart.filter((c) => c.id !== itemId);
      showNotification(`Đã xóa ${item.name} khỏi giỏ hàng`);
    } else {
      showNotification(`Đã giảm ${item.name} (${cartItem.quantity})`);
    }
  }

  updateCart();
  renderFoodItems();
  updateBookingFoodList();
}

// Remove item from cart
function removeFromCart(itemId) {
  const item = foodItems.find((f) => f.id === itemId);
  cart = cart.filter((c) => c.id !== itemId);
  showNotification(`Đã xóa ${item.name} khỏi giỏ hàng`);
  updateCart();
  renderFoodItems();
  updateBookingFoodList();
}

// Update cart display
function updateCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  // Always show cart total section
  cartTotal.style.display = "block";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                  <div style="font-size: 2rem; margin-bottom: 10px;">🛒</div>
                  <div style="font-weight: bold; margin-bottom: 5px;">Chưa chọn đồ ăn</div>
                  <div style="font-size: 0.9rem; color: #888;">Bạn có thể bỏ qua bước này</div>
                </div>
              `;
  } else {
    cartItemsContainer.innerHTML = "";
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;

      const cartItemElement = document.createElement("div");
      cartItemElement.className = "cart-item";
      cartItemElement.innerHTML = `
                    <img src="${item.image}" alt="${
        item.name
      }" class="cart-item-image" 
                         onerror="this.src='${getDefaultImage()}'">
                    <div class="cart-item-info">
                      <div class="cart-item-name">${item.name}</div>
                      <div class="cart-item-details">${
                        item.quantity
                      } x ${formatCurrency(item.price)} = ${formatCurrency(
        itemTotal
      )}</div>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart('${
                      item.id
                    }')" title="Xóa khỏi giỏ hàng">×</button>
                  `;
      cartItemsContainer.appendChild(cartItemElement);
    });
  }

  // Calculate totals using dynamicTicketPrice
  const foodTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const grandTotal = dynamicTicketPrice + foodTotal; // Sử dụng dynamicTicketPrice

  document.getElementById("food-total").textContent = formatCurrency(foodTotal);
  document.getElementById("total").textContent = formatCurrency(grandTotal);
}
function updateBookingFoodList() {
  const foodList = cart.map((item) => ({
    idfood: item.id,
    soluong: item.quantity,
  }));
  const bookingDataJson = localStorage.getItem("bookingData");
  let bookingData = bookingDataJson ? JSON.parse(bookingDataJson) : {};

  const totalText = document.getElementById("total").textContent;
  const totalNumber = parseInt(totalText.replace(/[^\d]/g, ""), 10);
  bookingData.foodList = foodList;
  bookingData.totalPrice = totalNumber;

  localStorage.setItem("bookingData", JSON.stringify(bookingData));
  console.log("📦 bookingData đã được cập nhật:", bookingData);
}
// Checkout function - UPDATED to show payment section
function checkout() {
  if (cart.length === 0) {
    if (
      confirm(
        "Bạn chưa chọn đồ ăn nào. Bạn có muốn tiếp tục thanh toán chỉ với vé xem phim không?"
      )
    ) {
      showPaymentSection(); // chỉ show nếu người dùng đồng ý
    } else {
      return; // thoát luôn nếu không muốn thanh toán
    }
  } else {
    showPaymentSection(); // nếu có đồ ăn thì show luôn
  }

  // Ẩn 2 nút
  document.querySelector(".checkout-btn").style.display = "none";
  document.querySelector(".skip-btn").style.display = "none";

  // Cập nhật progress-line
  const progressLine = document.querySelector(".progress-line");
  if (progressLine) {
    progressLine.style.width = "73%";
  }
}

// Skip food function - UPDATED to show payment section
function skipFood() {
  if (
    confirm("Bạn có chắc chắn muốn bỏ qua việc đặt đồ ăn và đồ uống không?")
  ) {
    showPaymentSection();

    // Ẩn 2 nút
    document.querySelector(".checkout-btn").style.display = "none";
    document.querySelector(".skip-btn").style.display = "none";
    // Cập nhật progress-line
    const progressLine = document.querySelector(".progress-line");
    if (progressLine) {
      progressLine.style.width = "73%";
    }
  }
}

// NEW FUNCTION: Show payment section and hide food section
function showPaymentSection() {
  // Hide food section
  const foodSection = document.querySelector(".food-section");
  if (foodSection) {
    foodSection.style.display = "none";
  }

  // Show payment section
  const paymentSection = document.getElementById("payment-section");
  if (paymentSection) {
    paymentSection.style.display = "block";
  }

  // Update progress bar to show payment step is active
  updateProgressBar(4); // Payment is step 4

  // Show notification
  showNotification("Chuyển đến bước thanh toán", "success");
}

// NEW FUNCTION: Go back to food selection
function goBackToFood() {
  // Show food section
  const foodSection = document.querySelector(".food-section");
  if (foodSection) {
    foodSection.style.display = "block";
  }

  // Hide payment section
  const paymentSection = document.getElementById("payment-section");
  if (paymentSection) {
    paymentSection.style.display = "none";
  }
  // Show the two buttons
  const checkoutBtn = document.querySelector(".checkout-btn");
  const skipBtn = document.querySelector(".skip-btn");

  if (checkoutBtn) {
    checkoutBtn.style.display = "inline-block"; // hoặc "block"
  }

  if (skipBtn) {
    skipBtn.style.display = "inline-block";
  }
  // Cập nhật progress-line
  const progressLine = document.querySelector(".progress-line");
  if (progressLine) {
    progressLine.style.width = "50%";
  }
  // Update progress bar to show food step is active again
  updateProgressBar(3); // Food is step 3

  showNotification("Quay lại chọn đồ ăn", "success");
}

// NEW FUNCTION: Update progress bar
function updateProgressBar(activeStep) {
  // Reset all steps
  const steps = document.querySelectorAll(".progress-step");
  steps.forEach((step, index) => {
    const circle = step.querySelector(".step-circle");
    const label = step.querySelector(".step-label");

    circle.classList.remove("active", "completed");
    label.classList.remove("active");

    if (index + 1 < activeStep) {
      circle.classList.add("completed");
      circle.textContent = "✓";
    } else if (index + 1 === activeStep) {
      circle.classList.add("active");
      label.classList.add("active");
      circle.textContent = activeStep;
    } else {
      circle.textContent = index + 1;
    }
  });
}

// NEW FUNCTION: Process payment
async function processPayment() {
  const selectedPayment = document.querySelector(
    'input[name="payment"]:checked'
  );

  if (!selectedPayment) {
    alert("Vui lòng chọn phương thức thanh toán!");
    return;
  }

  // Store order data
  const orderData = {
    movie: document.getElementById("movie-title").textContent,
    cinema: document.getElementById("cinema-name").textContent,
    date: document.getElementById("date-time").textContent,
    room: document.getElementById("room-name").textContent,
    seat: document.getElementById("selected-seats").textContent,
    ticketPrice: dynamicTicketPrice,
    foodItems: cart,
    foodTotal: cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
    grandTotal:
      dynamicTicketPrice +
      cart.reduce((total, item) => total + item.price * item.quantity, 0),
    paymentMethod: selectedPayment.value,
  };

  console.log("Processing payment with data:", orderData);
  localStorage.setItem("orderData", JSON.stringify(orderData));

  const token = sessionStorage.getItem("authToken");
  const user = JSON.parse(sessionStorage.getItem("user"));
  const bookingDataJson = localStorage.getItem("bookingData");
  let bookingData = bookingDataJson ? JSON.parse(bookingDataJson) : {};
  const bookingRequest = {
    idPhim: bookingData.idPhim,
    idPhong: bookingData.idPhong,
    selectedSeats: bookingData.selectedSeats,
    totalPrice: bookingData.totalPrice,
    bookingDate: bookingData.bookingDate,
    showTime: bookingData.showTime,
    foodList: bookingData.foodList || [],
    iduser: user.idUser,
  };
  console.log("Booking request data:", bookingRequest);

  // Show loading and process payment
  const proceedBtn = document.querySelector(".proceed-btn");
  const originalText = proceedBtn.innerHTML;
  proceedBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang xử lý...';
  proceedBtn.disabled = true;
  try {
    // Send booking request to API
    const response = await fetch("http://localhost:8080/api/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookingRequest),
    });

    const bookingResult = await response.json();
    console.log("Booking API Response:", bookingResult);

    if (!response.ok) {
      let errorMessage = "Không thể lưu thông tin đặt vé";
      if (response.status === 401) {
        errorMessage = "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại";
      } else if (response.status === 400) {
        errorMessage = bookingResult.message || "Dữ liệu đặt vé không hợp lệ";
      } else if (response.status === 500) {
        errorMessage = "Lỗi server khi lưu đặt vé, vui lòng thử lại sau";
      }
      throw new Error(errorMessage);
    }
    const paymentRequest = {
      idve: bookingResult.message,
      amount: bookingData.totalPrice,
      orderInfo: `Thanh toan ve xem phim ${
        bookingData.movieTitle
      } - ${bookingData.selectedSeats.join(", ")}`,
      bankCode: selectedPayment.value === "" ? "" : selectedPayment.value, // Empty for VNPay gateway selection
      locale: "vn",
      orderType: "billpayment",
    };
    console.log("Payment request data:", paymentRequest);
    const paymentResponse = await fetch(
      "http://localhost:8080/api/payment/vnpay/create",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentRequest),
      }
    );

    const paymentResult = await paymentResponse.json();
    console.log("Payment API Response:", paymentResult);

    if (
      paymentResponse.ok &&
      paymentResult.code === "00" &&
      paymentResult.vnpayUrl
    ) {
      // Save payment response
      localStorage.setItem("paymentResponse", JSON.stringify(paymentResult));

      // Redirect to VNPay URL
      window.location.href = paymentResult.vnpayUrl;
    } else {
      let errorMessage = "Không thể tạo liên kết thanh toán";
      if (paymentResponse.status === 401) {
        errorMessage = "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại";
      } else if (paymentResponse.status === 400) {
        errorMessage =
          paymentResult.message || "Dữ liệu thanh toán không hợp lệ";
      } else if (paymentResponse.status === 500) {
        errorMessage = "Lỗi server khi tạo thanh toán, vui lòng thử lại sau";
      } else {
        errorMessage = paymentResult.message || `Lỗi ${paymentResponse.status}`;
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error("Process payment error:", error);

    // Show user-friendly error messages
    if (error.name === "TypeError" && error.message.includes("fetch")) {
      alert("Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng!");
    } else {
      alert(`Có lỗi xảy ra: ${error.message}`);
    }

    // Reset button on error
    proceedBtn.innerHTML = originalText;
    proceedBtn.disabled = false;
  }
}
// // Simulate payment processing
// setTimeout(() => {
//   alert(
//     `Thanh toán thành công!\n\nPhương thức: ${getPaymentMethodName(
//       selectedPayment.value
//     )}\nTổng tiền: ${formatCurrency(orderData.grandTotal)}`
//   );

//   // Reset button
//   proceedBtn.innerHTML = originalText;
//   proceedBtn.disabled = false;

//   // Update progress to confirmation step
//   updateProgressBar(5);

//   // In real app, redirect to confirmation page
//   // window.location.href = '/html/confirmation.html';
// }, 2000);
// Helper function to get payment method name
function getPaymentMethodName(value) {
  const methods = {
    vnpay: "Ví MoMo",
    banking: "Internet Banking",
    card: "Thẻ Tín Dụng",
    QR: "Thanh Toán QR",
  };
  return methods[value] || value;
}

// Proceed to payment - DEPRECATED, replaced by showPaymentSection
function proceedToPayment() {
  showPaymentSection();
}

// Show notification for cart updates
function showNotification(message, type = "success") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === "success" ? "#28a745" : "#dc3545"};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 1000;
            font-weight: bold;
            transform: translateX(400px);
            transition: transform 0.3s ease;
          `;
  notification.textContent = message;

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)";
  }, 100);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(400px)";
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Add interactive effects
function addInteractiveEffects() {
  const foodItems = document.querySelectorAll(".food-item");

  foodItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
    });

    item.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });
}

// Animate progress bar on load
function animateProgressBar() {
  const progressLine = document.querySelector(".progress-line");
  if (progressLine) {
    // Add check for progressLine existence
    progressLine.style.width = "0%";

    setTimeout(() => {
      progressLine.style.width = "50%";
    }, 500);
  }
}

// Add loading animation for better UX
function enhanceLoadingAnimation() {
  const loading = document.getElementById("loading");
  if (loading) {
    // Add check for loading existence
    let dots = 0;
    const loadingInterval = setInterval(() => {
      dots = (dots + 1) % 4;
      loading.innerHTML = `<p>Đang tải danh sách sản phẩm${".".repeat(
        dots
      )}</p>`;
    }, 500);

    // Clear interval when loading is done
    // This timeout might not correctly clear if loadFoodItems takes longer
    // A better approach is to clear it when loadFoodItems resolves/rejects
    // setTimeout(() => {
    //   clearInterval(loadingInterval);
    // }, 5000);
  }
}

// Add keyboard shortcuts
function addKeyboardShortcuts() {
  document.addEventListener("keydown", function (e) {
    // Enter to proceed to checkout
    if (e.key === "Enter" && e.ctrlKey) {
      checkout();
    }

    // Escape to skip food
    if (e.key === "Escape") {
      skipFood();
    }

    // F5 to reload food items
    if (e.key === "F5" && e.ctrlKey) {
      e.preventDefault();
      loadFoodItems();
    }
  });
}

// Initialize the application
function init() {
  console.log("Galaxy Cinema Food Ordering System Initialized");
  console.log("API Endpoint:", FOOD_API_ENDPOINT);

  // Animate progress bar
  animateProgressBar();

  // Enhance loading animation
  enhanceLoadingAnimation();
  // Load remaining time - THÊM DÒNG NÀY
  loadRemainingTime();
  // Load food items from API
  loadFoodItems()
    .then(() => {
      // Add interactive effects after items are loaded
      setTimeout(addInteractiveEffects, 100);
    })
    .catch((error) => {
      console.error("Failed to initialize food items:", error);
    });

  // Add keyboard shortcuts
  addKeyboardShortcuts();

  // Load dynamic ticket price from localStorage
  loadTicketPriceFromLocalStorage();

  // Initialize cart display (should be called AFTER dynamicTicketPrice is loaded)
  updateCart();

  console.log("Food ordering system ready!");
}

// NEW FUNCTION: Load ticket price from localStorage
function loadTicketPriceFromLocalStorage() {
  const bookingDataJSON = localStorage.getItem("bookingData");
  if (bookingDataJSON) {
    try {
      const bookingData = JSON.parse(bookingDataJSON);
      console.log(bookingData);
      dynamicTicketPrice = parseFloat(bookingData.totalPrice) || 0;
      console.log(
        `Ticket price loaded from localStorage: ${dynamicTicketPrice}`
      );
    } catch (e) {
      console.error("Error parsing bookingData for ticket price:", e);
      dynamicTicketPrice = 0; // Fallback to 0 if error
    }
  } else {
    console.warn(
      "No bookingData found in localStorage. Ticket price defaulted to 0."
    );
    dynamicTicketPrice = 0; // Default if no booking data
  }
}

// Start the application when DOM is loaded
document.addEventListener("DOMContentLoaded", init);

// Add window resize handler for responsive behavior
window.addEventListener("resize", function () {
  // Adjust cart position on mobile
  const cartSection = document.querySelector(".cart-section");
  if (cartSection) {
    // Add check for cartSection existence
    if (window.innerWidth <= 1024) {
      cartSection.style.position = "static";
    } else {
      cartSection.style.position = "sticky";
    }
  }
});

// Add error handling for API calls
function handleApiError(error) {
  console.error("API Error:", error);

  if (error.name === "TypeError" && error.message.includes("fetch")) {
    return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
  } else if (error.message.includes("404")) {
    return "Không tìm thấy API endpoint. Vui lòng kiểm tra cấu hình máy chủ.";
  } else if (error.message.includes("500")) {
    return "Lỗi máy chủ nội bộ. Vui lòng thử lại sau.";
  } else {
    return error.message || "Đã xảy ra lỗi không xác định.";
  }
}

// Add window beforeunload handler
window.addEventListener("beforeunload", function (e) {
  if (cart.length > 0) {
    e.preventDefault();
    e.returnValue =
      "Bạn có các món đã chọn trong giỏ hàng. Bạn có chắc chắn muốn rời khỏi trang?";
  }
});

// Add periodic refresh option
function addPeriodicRefresh() {
  // Refresh every 5 minutes to get updated stock
  setInterval(() => {
    if (confirm("Bạn có muốn cập nhật danh sách sản phẩm không?")) {
      loadFoodItems();
    }
  }, 300000); // 5 minutes
}

// Initialize periodic refresh
setTimeout(addPeriodicRefresh, 60000); // Start after 1 minute

// CSS styles for additional elements (placed outside <script> or in a CSS file)
const additionalStyles = `
        <style>
          .food-stock {
            font-size: 0.8rem;
            color: #666;
            margin-bottom: 10px;
          }
          
          .error-message {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            margin: 20px 0;
          }
          
          .retry-btn {
            background: #ff6b35;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            transition: background 0.3s ease;
          }
          
          .retry-btn:hover {
            background: #e55a2e;
          }
          
          .food-item.selected {
            border: 2px solid #ff6b35;
            box-shadow: 0 4px 15px rgba(255, 107, 53, 0.2);
          }
          
          .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          
          .loading {
            text-align: center;
            padding: 40px;
            font-size: 1.1rem;
            color: #666;
          }
        </style>
      `;

document.head.insertAdjacentHTML("beforeend", additionalStyles);

// This function is for updating the display of the booking info table
// Make sure this is called after init() and after dynamicTicketPrice is set
function updateBookingInfo() {
  // 1. Lấy dữ liệu từ localStorage
  const bookingDataJSON = localStorage.getItem("bookingData");

  // 2. Kiểm tra xem có dữ liệu không
  if (!bookingDataJSON) {
    console.warn("Không tìm thấy dữ liệu 'bookingData' trong localStorage.");
    const defaultText = "Không có thông tin";
    document.getElementById("movie-title").textContent = defaultText;
    document.getElementById("cinema-name").textContent = defaultText;
    document.getElementById("date-time").textContent = defaultText;
    document.getElementById("room-name").textContent = defaultText;
    document.getElementById("selected-seats").textContent = defaultText;
    // Cập nhật cả phần tử hiển thị tiền vé mặc định nếu không có dữ liệu
    const ticketPriceDisplayElem = document.getElementById(
      "ticket-price-display"
    );
    if (ticketPriceDisplayElem) {
      ticketPriceDisplayElem.textContent = "0₫";
    }
    const totalPriceElem = document.getElementById("total-price"); // Tổng tiền lớn
    if (totalPriceElem) {
      totalPriceElem.textContent = "0₫";
    }
    return;
  }

  // 3. Phân tích chuỗi JSON thành đối tượng JavaScript
  let bookingData;
  try {
    bookingData = JSON.parse(bookingDataJSON);
  } catch (e) {
    console.error("Lỗi khi phân tích dữ liệu JSON từ localStorage:", e);
    localStorage.removeItem("bookingData");
    document.getElementById("movie-title").textContent = "Lỗi dữ liệu";
    return;
  }

  // 4. Lấy các phần tử HTML bằng ID
  const movieTitleElem = document.getElementById("movie-title");
  const cinemaNameElem = document.getElementById("cinema-name");
  const dateTimeElem = document.getElementById("date-time");
  const roomNameElem = document.getElementById("room-name");
  const selectedSeatsElem = document.getElementById("selected-seats");

  // Lấy phần tử cho TIỀN VÉ RIÊNG BIỆT (cái bạn vừa thêm ID)
  const ticketPriceDisplayElem = document.getElementById(
    "ticket-price-display"
  );

  // Lấy phần tử cho TỔNG TIỀN (nếu nó là tổng cuối cùng)
  const totalPriceElem = document.getElementById("total-price");

  // 5. Gán dữ liệu vào các phần tử tương ứng
  if (movieTitleElem) {
    movieTitleElem.textContent =
      bookingData.movieTitle ||
      bookingData.movie?.movieDetails?.tenphim ||
      "Không rõ";
  }
  if (cinemaNameElem) {
    cinemaNameElem.textContent = bookingData.movieCinema || "Không rõ";
  }
  if (dateTimeElem) {
    dateTimeElem.textContent = `${bookingData.movieDate || ""} - ${
      bookingData.movieTime || ""
    }`;
  }
  if (roomNameElem) {
    roomNameElem.textContent = bookingData.room?.tenphong || "Không rõ";
  }
  if (selectedSeatsElem) {
    selectedSeatsElem.textContent = bookingData.selectedSeats
      ? bookingData.selectedSeats.join(", ")
      : "Chưa chọn";
  }

  // Cập nhật TIỀN VÉ RIÊNG BIỆT từ bookingData.totalPrice (hoặc một trường khác nếu có)
  if (ticketPriceDisplayElem) {
    const rawTicketPrice = Number(bookingData.totalPrice) || 0;
    ticketPriceDisplayElem.textContent = formatCurrency(rawTicketPrice);
  }

  // Cập nhật TỔNG TIỀN (Nếu phần tử có ID 'total-price' là GRAND TOTAL)
  // Lưu ý: Phần này sẽ được hàm updateCart() cập nhật lại sau
  // nhưng chúng ta vẫn có thể gán giá trị ban đầu ở đây.
  if (totalPriceElem) {
    const rawGrandTotal = Number(bookingData.totalPrice) || 0;
    totalPriceElem.textContent = formatCurrency(rawGrandTotal);
  }

  console.log("Dữ liệu đặt vé đã được tải và cập nhật vào bảng.");
}

// Add event listener for updateBookingInfo to run on DOMContentLoaded
// It's already there at the bottom, ensure it's called after dynamicTicketPrice is set.
document.addEventListener("DOMContentLoaded", updateBookingInfo);
document.addEventListener("DOMContentLoaded", function () {
  console.log("sessionStorage content!", sessionStorage);
  const token = sessionStorage.getItem("authToken");

  if (token) {
    document.querySelector(".btn-login").style.display = "none";
    document.querySelector(".btn-register").style.display = "none";

    document.querySelector(".user-menu").style.display = "flex";
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
// Thêm cleanup khi user rời khỏi trang
window.addEventListener("beforeunload", function (e) {
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }

  if (cart.length > 0) {
    e.preventDefault();
    e.returnValue =
      "Bạn có các món đã chọn trong giỏ hàng. Bạn có chắc chắn muốn rời khỏi trang?";
  }
});
