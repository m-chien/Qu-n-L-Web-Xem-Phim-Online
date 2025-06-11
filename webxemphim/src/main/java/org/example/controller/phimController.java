package org.example.controller;

import org.example.dto.request.ApiResponse;
import org.example.dto.request.PhimDetailRequest;
import org.example.exception.AppException;
import org.example.exception.ErrorCode;
import org.example.model.phim;
import org.example.service.DienVienService;
import org.example.service.TheLoaiService;
import org.example.service.phimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
public class phimController {

    private final phimService phimService;
    private final DienVienService dienVienService;
    private final TheLoaiService theLoaiService;

    public phimController(org.example.service.phimService phimService, DienVienService dienVienService, TheLoaiService theLoaiService) {
        this.phimService = phimService;
        this.dienVienService = dienVienService;
        this.theLoaiService = theLoaiService;
    }

    @GetMapping
    public ApiResponse<List<phim>> getAllPhim() {
        ApiResponse<List<phim>> response = new ApiResponse<>();
        response.setResult(phimService.getallphim());
        response.setMessage("Lấy danh sách phim thành công!");
        return response;
    }

    @GetMapping("/{movieId}")
    public ApiResponse<PhimDetailRequest> getOnePhim(@PathVariable String movieId)
    {
        ApiResponse<PhimDetailRequest> phimApiResponse = new ApiResponse<>();
        phim phim1 = phimService.get1phim(movieId);
        PhimDetailRequest phimDetailRequest1 = PhimDetailRequest.builder()
                .idPhim(phim1.getIdPhim())
                .tenphim(phim1.getTenphim())
                .daodien(phim1.getDaodien())
                .thoiLuong(phim1.getThoiLuong())
                .ngaySanXuat(phim1.getNgaySanXuat())
                .luotXem(phim1.getLuotXem())
                .quocgia(phim1.getQuocgia())
                .gioihandotuoi(phim1.getGioihandotuoi())
                .trangthai(phim1.getTrangthai())
                .moTaPhim(phim1.getMoTaPhim())
                .url_anh(phim1.getUrl_anh())
                .tendienvien(dienVienService.GetListActorByIdphim(movieId))
                .tentheloai(theLoaiService.GetAllTheloaiByIdphim(movieId))
                .build();
        phimApiResponse.setResult(phimDetailRequest1);
        phimApiResponse.setMessage("Lấy thành công!!");
        return phimApiResponse;
    }

    @PostMapping("/addphim")
    public ApiResponse<phim> themphim(@RequestBody phim phim)
    {
        ApiResponse<phim> phimApiResponse = new ApiResponse<>();
        phimApiResponse.setResult(phimService.themPhim(phim));
        phimApiResponse.setMessage("thêm thành công!");
        return phimApiResponse;
    }

    @DeleteMapping("/delete/{idphim}")
    public ApiResponse deletephim(@PathVariable String idphim)
    {
        ApiResponse apiResponse = new ApiResponse<>();

        if(phimService.xoaphim(idphim))
        {
            apiResponse.setMessage("đã xóa phim thành công!!");
            return apiResponse;
        }
        else {
            throw new AppException(ErrorCode.Id_Not_Found);
        }
    }

    @PutMapping("/update/{idphim}")
    public ApiResponse<phim> updatephim(@PathVariable String idphim,@RequestBody phim phim1)
    {
        ApiResponse<phim> phimApiResponse = new ApiResponse<>();
        phimApiResponse.setResult(phimService.updatephim(idphim,phim1));
        phimApiResponse.setMessage("update thành công!");
        return phimApiResponse;
    }
}
