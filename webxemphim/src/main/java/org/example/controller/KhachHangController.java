package org.example.controller;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.example.dto.request.ApiResponse;
import org.example.dto.request.khachhangUpdateRequest;
import org.example.model.khachhang;
import org.example.service.KhachHangService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/khachhang")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class KhachHangController {
    private final KhachHangService khachHangService;

    @PutMapping("/update-profile")
    public ApiResponse<khachhang> updateProfile(
            @RequestBody khachhangUpdateRequest request,
            @RequestHeader("Authorization") String authorizationHeader
    ) {
        try {
            log.info("Updating profile for user: {}", request.getIdUser());

            // Extract token from Authorization header
            String token = null;
            if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
                token = authorizationHeader.substring(7);
            }

            if (token == null || token.trim().isEmpty()) {
                return ApiResponse.<khachhang>builder()
                        .code(1001)
                        .message("Token không hợp lệ")
                        .build();
            }

            khachhang updatedKhachHang = khachHangService.updateProfile(request, token);

            log.info("Profile updated successfully for user: {}", request.getIdUser());

            return ApiResponse.<khachhang>builder()
                    .code(1000)
                    .message("Cập nhật thông tin thành công")
                    .result(updatedKhachHang)
                    .build();

        } catch (RuntimeException e) {
            log.error("Error updating profile for user {}: {}", request.getIdUser(), e.getMessage());
            return ApiResponse.<khachhang>builder()
                    .code(1002)
                    .message(e.getMessage())
                    .build();
        } catch (Exception e) {
            log.error("Unexpected error updating profile for user {}: {}", request.getIdUser(), e.getMessage());
            return ApiResponse.<khachhang>builder()
                    .code(1003)
                    .message("Có lỗi xảy ra khi cập nhật thông tin")
                    .build();
        }
    }
}
