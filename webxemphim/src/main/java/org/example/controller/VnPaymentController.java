package org.example.controller;

import org.example.dto.request.VnpayPaymentRequest;
import org.example.dto.request.VnpayPaymentResponse; // Nên là org.example.dto.response
import org.example.service.BookingService;
import org.example.service.VnpayPaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.servlet.view.RedirectView;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
public class VnPaymentController {

    @Autowired
    private VnpayPaymentService vnpayPaymentService;
    @Autowired
    private BookingService bookingService;

    /**
     * API để tạo URL thanh toán VNPAY.
     * Nhận các thông tin cần thiết từ body request và trả về URL VNPAY.
     *
     * @param requestBody DTO chứa thông tin yêu cầu thanh toán
     * @return ResponseEntity chứa URL VNPAY hoặc thông báo lỗi
     */
    @PostMapping("/vnpay/create")
    public ResponseEntity<?> createVnpayPayment(@RequestBody VnpayPaymentRequest requestBody) {
        try {
            // Kiểm tra các trường bắt buộc
            if (requestBody.getAmount() == null || requestBody.getAmount() <= 0 ||
                    requestBody.getOrderInfo() == null || requestBody.getOrderInfo().isEmpty()) {
                return ResponseEntity.badRequest().body("❌ Thiếu thông tin bắt buộc: amount, orderInfo.");
            }

            // Gọi service để tạo URL thanh toán VNPAY
            String vnpayUrl = vnpayPaymentService.createVnpayPaymentUrl(requestBody);

            // Trả về URL VNPAY cho frontend
            return ResponseEntity.ok(new VnpayPaymentResponse(vnpayUrl, "Thành công", "00"));

        } catch (UnsupportedEncodingException | NoSuchAlgorithmException | InvalidKeyException e) {
            System.err.println("ERROR - Lỗi khi tạo URL VNPAY: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Lỗi hệ thống khi tạo URL thanh toán: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("ERROR - Lỗi không xác định khi tạo thanh toán VNPAY: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("❌ Lỗi hệ thống: " + e.getMessage());
        }
    }

    /**
     * Endpoint xử lý callback từ VNPAY sau khi thanh toán.
     * Đây là GET request từ trình duyệt của người dùng.
     *
     * @param request HttpServletRequest chứa các tham số từ VNPAY
     * @return Thông báo kết quả thanh toán
     */

    @GetMapping("/vnpay/return")
    public RedirectView handleVnpayReturn(HttpServletRequest request) throws UnsupportedEncodingException {
        Map<String, String> vnp_Params = new HashMap<>();
        Enumeration<String> params = request.getParameterNames();
        while (params.hasMoreElements()) {
            String fieldName = params.nextElement();
            String fieldValue = request.getParameter(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                try {
                    vnp_Params.put(fieldName, URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                } catch (UnsupportedEncodingException e) {
                    System.err.println("ERROR - Encoding parameter " + fieldName + ": " + e.getMessage());
                    vnp_Params.put(fieldName, fieldValue);
                }
            }
        }

        System.out.println("DEBUG - VNPAY Callback Params (raw values from URL, encoded for map display): " + vnp_Params);

        String redirectUrl = "/html/xacnhan.html"; // URL cho trang kết quả thanh toán trên frontend của bạn

        try {
            String secureHash = vnp_Params.get("vnp_SecureHash");
            if (secureHash == null) {
                System.err.println("❌ VNPAY Return: Không tìm thấy vnp_SecureHash trong params.");
                redirectUrl += "?status=failed&message=Thiếu chữ ký";
                return new RedirectView(redirectUrl);
            }

            Map<String, String> verifyParams = new HashMap<>(vnp_Params);
            verifyParams.remove("vnp_SecureHash");

            List<String> fieldNamesForHash = new ArrayList<>(verifyParams.keySet());
            Collections.sort(fieldNamesForHash);
            StringBuilder hashData = new StringBuilder();
            Iterator<String> itr = fieldNamesForHash.iterator();
            while (itr.hasNext()) {
                String fieldName = itr.next();
                String fieldValue = verifyParams.get(fieldName);
                if ((fieldValue != null) && (fieldValue.length() > 0)) {
                    hashData.append(fieldName);
                    hashData.append("=");
                    hashData.append(fieldValue);
                    if (itr.hasNext()) {
                        hashData.append("&");
                    }
                }
            }

            System.out.println("DEBUG - VNPAY Hash Data (verify): " + hashData.toString());
            String signedHash = vnpayPaymentService.hmacSHA512(vnpayPaymentService.getHashSecret(), hashData.toString());
            System.out.println("DEBUG - Calculated Signature (verify): " + signedHash);
            System.out.println("DEBUG - Received Signature (VNPAY): " + secureHash);

            if (secureHash.equals(signedHash)) {
                String vnp_ResponseCode = vnp_Params.get("vnp_ResponseCode");
                String vnp_TxnRef = vnp_Params.get("vnp_TxnRef"); // Mã giao dịch của bạn (orderId)
                String vnp_Amount = vnp_Params.get("vnp_Amount"); // Số tiền đã thanh toán (đơn vị xu)
                String vnp_BankTranNo = vnp_Params.get("vnp_BankTranNo"); // Mã giao dịch ngân hàng
                String vnp_PayDate = vnp_Params.get("vnp_PayDate"); // Ngày giờ thanh toán

                if ("00".equals(vnp_ResponseCode)) {
                    // ✅ Giao dịch thành công!
                    System.out.println("✅ VNPAY Return: Thanh toán thành công! Mã giao dịch: " + vnp_TxnRef + ", Số tiền: " + vnp_Amount);

                    // CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG TRONG DATABASE CỦA BẠN LÀ "PAID" HOẶC "SUCCESS"
                    bookingService.updateOrderStatus(vnp_TxnRef,1);

                    redirectUrl += "?status=success&orderId=" + vnp_TxnRef + "&amount=" + vnp_Amount;
                    return new RedirectView(redirectUrl);
                } else {
                    // ❌ Giao dịch thất bại hoặc chờ xử lý
                    String vnp_Message = vnp_Params.get("vnp_Message");
                    System.out.println("❌ VNPAY Return: Thanh toán thất bại. Mã lỗi: " + vnp_ResponseCode + ", Thông báo: " + vnp_Message + ", Mã giao dịch: " + vnp_TxnRef);
                    bookingService.updateOrderStatus(vnp_TxnRef,0);
                    redirectUrl += "?status=failed&orderId=" + vnp_TxnRef + "&responseCode=" + vnp_ResponseCode + "&message=" + URLEncoder.encode(vnp_Message, StandardCharsets.UTF_8.toString());
                    return new RedirectView(redirectUrl);
                }
            } else {
                // ❌ Chữ ký không hợp lệ
                System.err.println("❌ VNPAY Return: Chữ ký không hợp lệ. Calculated: " + signedHash + ", Received: " + secureHash);
                redirectUrl += "?status=invalid_signature&message=Chữ ký không hợp lệ";
                return new RedirectView(redirectUrl);
            }
        } catch (Exception e) {
            System.err.println("ERROR - Lỗi xử lý VNPAY Return: " + e.getMessage());
            e.printStackTrace();
            redirectUrl += "?status=error&message=" + URLEncoder.encode("Lỗi hệ thống khi xử lý kết quả VNPAY.", StandardCharsets.UTF_8.toString());
            return new RedirectView(redirectUrl);
        }
    }
}
