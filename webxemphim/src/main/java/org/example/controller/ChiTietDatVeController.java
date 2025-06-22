package org.example.controller;

import org.example.dto.ChiTietDatVeDTO.ChiTietDatVeResponseDTO;
import org.example.dto.request.ApiResponse;
import org.example.service.ChiTietDatVeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ve")
public class ChiTietDatVeController {

    @Autowired
    private ChiTietDatVeService chiTietDatVeService;

    @GetMapping("/chi-tiet/{idVe}")
    public ResponseEntity<?> getChiTietDatVe(@PathVariable String idVe) {
        try {
            // Kiểm tra input
            if (idVe == null || idVe.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(new ApiResponse<>(1001, "ID vé không được để trống", null));
            }

            // Kiểm tra vé có tồn tại không
            if (!chiTietDatVeService.kiemTraVeTonTai(idVe)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ApiResponse<>(1001, "Không tìm thấy vé với ID: " + idVe, null));
            }

            // Lấy chi tiết đặt vé
            ChiTietDatVeResponseDTO chiTiet = chiTietDatVeService.getChiTietDatVe(idVe);

            return ResponseEntity.ok(new ApiResponse<>(1000, "Lấy thông tin chi tiết vé thành công", chiTiet));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(1000, "Lỗi hệ thống: " + e.getMessage(), null));
        }
    }
}
