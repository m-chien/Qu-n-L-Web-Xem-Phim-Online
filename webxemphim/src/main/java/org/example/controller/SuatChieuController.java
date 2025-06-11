package org.example.controller;

import org.example.dto.request.ApiResponse;
import org.example.exception.AppException;
import org.example.exception.ErrorCode;
import org.example.service.SuatChieuService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/showtime")
public class SuatChieuController {
    private final SuatChieuService suatChieuService;

    public SuatChieuController(SuatChieuService suatChieuService) {
        this.suatChieuService = suatChieuService;
    }
    @GetMapping("/{idphim}/{ngaychieu}")
    public ApiResponse<List<LocalTime>> getSuatchieuByIdphimAndNgaychieu(
            @PathVariable String idphim,
            @PathVariable LocalDate ngaychieu) {
        try {
            List<LocalTime> result = suatChieuService.getSuatchieuByPhim(idphim, ngaychieu);
            ApiResponse<List<LocalTime>> response = new ApiResponse<>();
            response.setResult(result);
            response.setMessage("Lấy thành công suất chiếu");
            return response;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
