package org.example.dto.request; // Nên là org.example.dto.response cho rõ ràng

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO cho phản hồi từ VNPAY API (chủ yếu là URL thanh toán).
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VnpayPaymentResponse {
    private String vnpayUrl; // URL để chuyển hướng người dùng đến cổng thanh toán VNPAY
    private String message;  // Thông báo (nếu có)
    private String code;     // Mã trạng thái (ví dụ: 00 cho thành công)
}
