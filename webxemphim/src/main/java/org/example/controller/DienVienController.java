package org.example.controller;

import org.example.service.DienVienService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/Actor")
public class DienVienController {
    private final DienVienService dienVienService;

    public DienVienController(DienVienService dienVienService) {
        this.dienVienService = dienVienService;
    }

}
