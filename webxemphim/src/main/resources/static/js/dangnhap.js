// DOM Elements
const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
const loadingOverlay = document.getElementById("loadingOverlay");

// API Configuration
const API_BASE_URL = "http://localhost:8080/api";
const AUTH_ENDPOINTS = {
  login: `${API_BASE_URL}/auth/login`,
  register: `${API_BASE_URL}/auth/register`,
  forgotPassword: `${API_BASE_URL}/auth/forgot-password`,
};

// Panel Switching
signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

// Password Toggle
function togglePassword(inputId, icon) {
  const input = document.getElementById(inputId);
  const type = input.getAttribute("type") === "password" ? "text" : "password";
  input.setAttribute("type", type);

  // Toggle icon
  icon.classList.toggle("fa-eye");
  icon.classList.toggle("fa-eye-slash");
}

// Form Validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
}

function validatePhone(phone) {
  // Vietnamese phone number format
  const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
  return phoneRegex.test(phone);
}

function validateName(name) {
  return name.trim().length >= 2;
}

// Show/Hide Loading
function showLoading() {
  loadingOverlay.style.display = "flex";
}

function hideLoading() {
  loadingOverlay.style.display = "none";
}

// Modal Functions
function showModal(modalId, message) {
  const modal = document.getElementById(modalId);
  const messageElement = modal.querySelector(".modal-body p");
  messageElement.textContent = message;
  modal.style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Close modal when clicking outside
window.addEventListener("click", (event) => {
  if (event.target.classList.contains("modal")) {
    event.target.style.display = "none";
  }
});

// API Functions
async function makeRequest(url, data) {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || "Có lỗi xảy ra");
    }

    return result;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Login Handler
async function handleLogin(event) {
  event.preventDefault();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  // Validation
  if (!email || !password) {
    showModal("errorModal", "Vui lòng điền đầy đủ thông tin.");
    return;
  }

  if (!validateEmail(email)) {
    showModal("errorModal", "Email không hợp lệ.");
    return;
  }

  try {
    showLoading();

    const loginData = {
      email: email,
      matkhau: password,
    };

    const response = await makeRequest(AUTH_ENDPOINTS.login, loginData);

    // Store authentication data in sessionStorage
    if (response.code === 1000 && response.result?.token) {
      sessionStorage.setItem("authToken", response.result.token);
      sessionStorage.setItem("user", JSON.stringify(response.result.user));
      hideLoading();
      showModal("successModal", "Đăng nhập thành công.");
      // Redirect after modal closes
      setTimeout(() => {
        window.location.href = "/html/trangchu.html";
      }, 1000);
    } else {
      hideLoading();
      showModal("errorModal", response.message);
    }
  } catch (error) {
    hideLoading();
    showModal("errorModal", error.message || "Đăng nhập thất bại.");
  }
}

// Register Handler
async function handleRegister(event) {
  event.preventDefault();

  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("registerEmail").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const password = document.getElementById("registerPassword").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const agreeTerms = document.getElementById("agreeTerms").checked;

  // Validation
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !confirmPassword
  ) {
    showModal("errorModal", "Vui lòng điền đầy đủ thông tin.");
    return;
  }

  if (!validateName(firstName) || !validateName(lastName)) {
    showModal("errorModal", "Họ và tên phải có ít nhất 2 ký tự.");
    return;
  }

  if (!validateEmail(email)) {
    showModal("errorModal", "Email không hợp lệ.");
    return;
  }

  if (!validatePhone(phone)) {
    showModal("errorModal", "Số điện thoại không hợp lệ.");
    return;
  }

  if (!validatePassword(password)) {
    showModal(
      "errorModal",
      "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số."
    );
    return;
  }

  if (password !== confirmPassword) {
    showModal("errorModal", "Mật khẩu xác nhận không khớp.");
    return;
  }

  if (!agreeTerms) {
    showModal("errorModal", "Vui lòng đồng ý với điều khoản sử dụng.");
    return;
  }

  try {
    showLoading();

    // Gộp firstName + lastName
    const registerData = {
      hoten: `${firstName} ${lastName}`,
      email: email,
      sdt: phone,
      matkhau: password,
    };

    const response = await makeRequest(AUTH_ENDPOINTS.register, registerData);

    if (response.code === 1000) {
      hideLoading();
      showModal(
        "successModal",
        "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản."
      );

      // Sau khi đăng kí, chuyển sang form đăng nhập
      setTimeout(() => {
        container.classListRemove("right-panel-active");

        registerForm.reset();
        closeModal("successModal");
      }, 3000);
    } else {
      // Nếu có lỗi từ phía server
      hideLoading();
      showModal("errorModal", response.message);
    }
  } catch (error) {
    hideLoading();
    showModal("errorModal", error.message || "Đăng ký thất bại.");
  }
}

// Social Login Handlers
function handleGoogleLogin() {
  // Integrate with Google OAuth
  // window.location.href = `${API_BASE_URL}/oauth2/authorization/google`;
  showModal("errorModal", "Chức năng đăng nhập Google đang được phát triển");
}

function handleFacebookLogin() {
  // Integrate with Facebook OAuth
  showModal("errorModal", "Chức năng đăng nhập Facebook đang được phát triển");
}

// Forgot Password Handler
function handleForgotPassword() {
  const email = prompt("Vui lòng nhập email của bạn:");

  if (!email) return;

  if (!validateEmail(email)) {
    showModal("errorModal", "Email không hợp lệ");
    return;
  }

  // API call for forgot password
  showLoading();

  makeRequest(AUTH_ENDPOINTS.forgotPassword, { email })
    .then(() => {
      hideLoading();
      showModal(
        "successModal",
        "Đã gửi email khôi phục mật khẩu. Vui lòng kiểm tra hộp thư."
      );
    })
    .catch((error) => {
      hideLoading();
      showModal("errorModal", error.message || "Có lỗi xảy ra");
    });
}

// Input Enhancement
function enhanceInputs() {
  // Add real-time validation feedback
  const inputs = document.querySelectorAll("input");

  inputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateInput(this);
    });

    input.addEventListener("input", function () {
      clearInputError(this);
    });
  });
}

function validateInput(input) {
  const value = input.value.trim();
  const inputGroup = input.closest(".input-group");

  // Remove existing error styles
  inputGroup.classList.remove("error");

  // Validate based on input type
  let isValid = true;

  switch (input.type) {
    case "email":
      isValid = validateEmail(value);
      break;
    case "password":
      if (input.id === "registerPassword") {
        isValid = validatePassword(value);
      } else {
        isValid = value.length > 0;
      }
      break;
    case "tel":
      isValid = validatePhone(value);
      break;
    case "text":
      isValid = validateName(value);
      break;
  }

  if (!isValid && value.length > 0) {
    inputGroup.classList.add("error");
  }
}

function clearInputError(input) {
  const inputGroup = input.closest(".input-group");
  inputGroup.classList.remove("error");
}

// Auto-fill handling
function handleAutoFill() {
  // Check for stored credentials
  const savedEmail = localStorage.getItem("rememberedEmail");
  if (savedEmail) {
    document.getElementById("loginEmail").value = savedEmail;
  }
}

// Event Listeners
document.addEventListener("DOMContentLoaded", function () {
  // Form submissions
  loginForm.addEventListener("submit", handleLogin);
  registerForm.addEventListener("submit", handleRegister);

  // Social login buttons
  document.querySelectorAll(".btn-social.google").forEach((btn) => {
    btn.addEventListener("click", handleGoogleLogin);
  });

  document.querySelectorAll(".btn-social.facebook").forEach((btn) => {
    btn.addEventListener("click", handleFacebookLogin);
  });

  // Forgot password link
  document
    .querySelector(".forgot-password")
    .addEventListener("click", function (e) {
      e.preventDefault();
      handleForgotPassword();
    });

  // Initialize enhancements
  enhanceInputs();
  handleAutoFill();

  // Check if user is already logged in
  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  if (token) {
    // Optionally redirect to dashboard if already logged in
    // window.location.href = 'index.html';
  }
});

// Keyboard shortcuts
document.addEventListener("keydown", function (e) {
  // Enter key on overlay buttons
  if (e.key === "Enter") {
    if (document.activeElement.id === "signUp") {
      signUpButton.click();
    } else if (document.activeElement.id === "signIn") {
      signInButton.click();
    }
  }

  // Escape key to close modals
  if (e.key === "Escape") {
    document.querySelectorAll(".modal").forEach((modal) => {
      if (modal.style.display === "block") {
        modal.style.display = "none";
      }
    });
  }
});

// Additional CSS for input error states
const style = document.createElement("style");
style.textContent = `
  .input-group.error input {
    border-color: #dc3545 !important;
    box-shadow: 0 0 10px rgba(220, 53, 69, 0.3) !important;
  }
  
  .input-group.error i {
    color: #dc3545 !important;
  }
`;
document.head.appendChild(style);
