package org.example.service;

import org.example.config.VnpayConfig;
import org.example.dto.request.VnpayPaymentRequest;
 // Import VnpayConfig
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class VnpayPaymentService {

    @Value("${vnpay.tmnCode}")
    private String vnp_TmnCode;

    @Value("${vnpay.hashSecret}")
    private String vnp_HashSecret;

    @Value("${vnpay.apiUrl}")
    private String vnp_apiUrl;

    @Value("${vnpay.returnUrl}")
    private String vnp_ReturnUrl;

    /**
     * Tạo URL thanh toán VNPAY.
     *
     * @param request DTO chứa thông tin yêu cầu thanh toán
     * @return URL thanh toán VNPAY
     * @throws UnsupportedEncodingException Nếu có lỗi mã hóa URL
     * @throws NoSuchAlgorithmException Nếu không tìm thấy thuật toán mã hóa
     * @throws InvalidKeyException Nếu khóa bí mật không hợp lệ
     */
    public String createVnpayPaymentUrl(VnpayPaymentRequest request)
            throws UnsupportedEncodingException, NoSuchAlgorithmException, InvalidKeyException {

        // Lấy thời gian hiện tại
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        SimpleDateFormat formatter = new SimpleDateFormat("yyyyMMddHHmmss");
        String vnp_CreateDate = formatter.format(cld.getTime());

        // Lấy thời gian hết hạn (ví dụ: 15 phút sau)
        cld.add(Calendar.MINUTE, 15);
        String vnp_ExpireDate = formatter.format(cld.getTime());

        // Tạo Map chứa các tham số sẽ gửi đến VNPAY
        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", VnpayConfig.vnp_Version);
        vnp_Params.put("vnp_Command", VnpayConfig.vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(request.getAmount() * 100)); // Số tiền * 100 (đơn vị là xu)
        vnp_Params.put("vnp_CurrCode", "VND"); // Đơn vị tiền tệ
        vnp_Params.put("vnp_TxnRef", request.getIdve()); // Mã giao dịch duy nhất của bạn
        vnp_Params.put("vnp_OrderInfo", request.getOrderInfo());
        vnp_Params.put("vnp_OrderType", request.getOrderType() != null ? request.getOrderType() : "other"); // Loại đơn hàng
        vnp_Params.put("vnp_Locale", request.getLocale() != null ? request.getLocale() : "vn"); // Ngôn ngữ
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl); // URL trả về sau thanh toán
        vnp_Params.put("vnp_IpAddr", "127.0.0.1"); // IP của khách hàng (có thể lấy từ HttpServletRequest)
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);
        vnp_Params.put("vnp_ExpireDate", vnp_ExpireDate);

        if (request.getBankCode() != null && !request.getBankCode().isEmpty()) {
            vnp_Params.put("vnp_BankCode", request.getBankCode());
        }

        // Sắp xếp các tham số theo thứ tự bảng chữ cái
        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                // Build hash data (chỉ mã hóa một lần)
                hashData.append(fieldName);
                hashData.append("=");
                // Mã hóa giá trị cho hashData
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                // Build query (mã hóa giá trị cho queryUrl)
                query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()));
                query.append("=");
                // Mã hóa giá trị cho queryUrl
                query.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));

                if (itr.hasNext()) {
                    query.append("&");
                    hashData.append("&");
                }
            }
        }

        String queryUrl = query.toString();
        System.out.println("DEBUG - VNPAY Hash Data (create): " + hashData.toString());
        String vnp_SecureHash = hmacSHA512(vnp_HashSecret, hashData.toString());
        queryUrl += "&vnp_SecureHash=" + vnp_SecureHash;

        return vnp_apiUrl + "?" + queryUrl;
    }

    /**
     * Xác minh chữ ký của phản hồi từ VNPAY.
     *
     * @param vnp_Params Map chứa các tham số từ VNPAY callback
     * @return true nếu chữ ký hợp lệ, false nếu không
     * @throws NoSuchAlgorithmException Nếu không tìm thấy thuật toán mã hóa
     * @throws InvalidKeyException Nếu khóa bí mật không hợp lệ
     * @throws UnsupportedEncodingException Nếu có lỗi mã hóa URL
     */
    public boolean verifyVnpaySignature(Map<String, String> vnp_Params)
            throws NoSuchAlgorithmException, InvalidKeyException, UnsupportedEncodingException {
        // Lấy vnp_SecureHash từ params
        String secureHash = vnp_Params.get("vnp_SecureHash");
        if (secureHash == null) {
            return false; // Không có chữ ký để xác minh
        }

        // Loại bỏ vnp_SecureHash khỏi params để tạo chuỗi hashData
        vnp_Params.remove("vnp_SecureHash");

        // Sắp xếp các tham số theo thứ tự bảng chữ cái
        List fieldNames = new ArrayList(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        Iterator itr = fieldNames.iterator();
        while (itr.hasNext()) {
            String fieldName = (String) itr.next();
            String fieldValue = (String) vnp_Params.get(fieldName);
            if ((fieldValue != null) && (fieldValue.length() > 0)) {
                hashData.append(fieldName);
                hashData.append("=");
                // Mã hóa giá trị cho hashData (chỉ một lần)
                hashData.append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
                if (itr.hasNext()) {
                    hashData.append("&");
                }
            }
        }

        String signedHash = hmacSHA512(vnp_HashSecret, hashData.toString());

        return secureHash.equals(signedHash);
    }

    /**
     * Hàm tạo chữ ký HMAC SHA512.
     *
     * @param key Chuỗi khóa bí mật (HashSecret)
     * @param data Chuỗi dữ liệu cần ký
     * @return Chuỗi chữ ký hex
     * @throws NoSuchAlgorithmException Nếu không tìm thấy thuật toán mã hóa
     * @throws InvalidKeyException Nếu khóa bí mật không hợp lệ
     */
    public String hmacSHA512(String key, String data) throws NoSuchAlgorithmException, InvalidKeyException {
        Mac hmacSha512 = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmacSha512.init(secretKey);
        byte[] hash = hmacSha512.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    // Trong VnpayPaymentService.java
    public String getHashSecret() {
        return vnp_HashSecret;
    }
}
