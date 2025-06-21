package org.example.controller;

import com.nimbusds.jose.JOSEException;
import lombok.RequiredArgsConstructor;
import org.example.dto.request.LichSuVeResponse;
import org.example.service.JwtService;
import org.example.service.VeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/api/ticket")
@RequiredArgsConstructor
public class VeController {
    private final VeService veService;

    @GetMapping("/lich-su")
    public ResponseEntity<List<LichSuVeResponse>> getLichSuVe(@RequestHeader("Authorization") String authorizationHeader) throws ParseException, JOSEException {
        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        }
        List<LichSuVeResponse> lichSu = veService.GetAllLichSuVe(token);
        return ResponseEntity.ok(lichSu);
    }
}
