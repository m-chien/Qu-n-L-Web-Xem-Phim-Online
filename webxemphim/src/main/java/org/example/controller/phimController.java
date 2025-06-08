package org.example.controller;

import org.example.dto.request.ApiResponse;
import org.example.exception.AppException;
import org.example.exception.ErrorCode;
import org.example.model.phim;
import org.example.service.phimService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class phimController {
    @Autowired
    private phimService phimService;

    @GetMapping("/movies")
    public List<phim> getAllPhim()
    {
        return phimService.getallphim();
    }

    @GetMapping("/getone/{idphim}")
    public ApiResponse<phim> getOnePhim(@PathVariable String idphim)
    {
        ApiResponse<phim> phimApiResponse = new ApiResponse<>();
        phimApiResponse.setResult(phimService.get1phim(idphim));
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
