package org.example.controller;

import org.example.model.chongoi;
import org.example.service.ChoNgoiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/seat")
public class ChoNgoiController {
    private final ChoNgoiService choNgoiService;

    public ChoNgoiController(ChoNgoiService choNgoiService) {
        this.choNgoiService = choNgoiService;
    }
    @GetMapping
    public ResponseEntity<List<chongoi>> GetChoNgoiFromPhong(
            @RequestParam String tenphim,
            @RequestParam LocalTime suat,
            @RequestParam LocalDate ngay) {
        return ResponseEntity.ok(choNgoiService.GetChoNgoiByPhong(tenphim, suat, ngay));
    }
}
