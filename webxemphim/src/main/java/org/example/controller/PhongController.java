package org.example.controller;

import org.example.model.phong;
import org.example.service.PhongService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/room")
public class PhongController {
    private final PhongService phongService;

    public PhongController(PhongService phongService) {
        this.phongService = phongService;
    }
    @GetMapping
    public ResponseEntity<phong> getPhongCoItNguoiDat(
            @RequestParam String tenphim,
            @RequestParam LocalTime suat,
            @RequestParam LocalDate ngay) {
        phong phong = phongService.getPhongCoItNguoiDat(tenphim, suat, ngay);
        return ResponseEntity.ok(phong);
    }
}
