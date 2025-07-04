package org.example.dto.request;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

/**
 * DTO cho yêu cầu tạo URL thanh toán VNPAY.
 * Các trường này sẽ được sử dụng để xây dựng chuỗi query gửi đến VNPAY.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class VnpayPaymentRequest {
    private String idve;
    private Long amount; // Số tiền (ví dụ: 100000 cho 100,000 VND)
    private String orderInfo; // Thông tin đơn hàng
    private String bankCode; // Mã ngân hàng (ví dụ: VNBANK, NCB, BIDV, v.v.)
    private String locale = "vn"; // Ngôn ngữ (vn/en)
    private String orderType = "billpayment"; // Loại đơn hàng (ví dụ: topup, billpayment, v.v.)
}
