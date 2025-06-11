package org.example.controller;

import org.example.dto.request.ApiResponse;
import org.example.service.LichChieuService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/schedule")
public class LichChieuController {
    private final LichChieuService lichChieuService;

    public LichChieuController(LichChieuService lichChieuService) {
        this.lichChieuService = lichChieuService;
    }
    @GetMapping("/date/{idmovie}")
    public ApiResponse<List<LocalDate>> getngayByIdmovie(@PathVariable String idmovie)
    {
        ApiResponse<List<LocalDate>> ans = new ApiResponse<>();
        ans.setResult(lichChieuService.GetDateByIdphim(idmovie));
        ans.setMessage("lấy thành công");
        return ans;
    }
}
