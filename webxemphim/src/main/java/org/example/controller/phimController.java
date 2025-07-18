package org.example.controller;

import com.nimbusds.jose.JOSEException;
import lombok.RequiredArgsConstructor;
import org.example.dto.Searching.FindingMoviesResponse;
import org.example.dto.Searching.FindingRequest;
import org.example.dto.Searching.FindingResponse;
import org.example.dto.Searching.FlatMovieRows;
import org.example.dto.request.*;
import org.example.exception.AppException;
import org.example.exception.ErrorCode;
import org.example.model.phim;
import org.example.service.DienVienService;
import org.example.service.JwtService;
import org.example.service.TheLoaiService;
import org.example.service.phimService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.util.List;
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/movies")
public class phimController {

    private final phimService phimService;
    private final DienVienService dienVienService;
    private final TheLoaiService theLoaiService;
    private final JwtService jwtService;

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
    //tìm kiếm
    @PostMapping("/search/{page}")
    public ResponseEntity<ApiResponse<FindingResponse>> searchMovies(
            @PathVariable int page,
            @RequestBody FindingRequest request,
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader
    ) throws ParseException, JOSEException {

        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        }
        if (request.getIduser() != null && !request.getIduser().isEmpty()) {
            if (token == null || !jwtService.check(token, request.getIduser())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                        ApiResponse.<FindingResponse>builder()
                                .code(401)
                                .message("Token không hợp lệ hoặc hết hạn")
                                .build()
                );
            }
        }
        int limit = 6;
        int offset = (page - 1) * limit;
        List<String> idList = phimService.findMoviesDynamic(request, limit, offset);
        List<FlatMovieRows> flatMovies = phimService.findfilm(idList);
        List<FindingMoviesResponse> movieList = phimService.findListfilm(flatMovies);
        int totalItems = phimService.countfilm(request);
        int totalPages = (int) Math.ceil((double) totalItems / limit);
        return ResponseEntity.ok(ApiResponse.<FindingResponse>builder()
                .code(1000)
                .message("Lấy thành công dữ liệu")
                .result(FindingResponse.builder()
                        .currentPage(page)
                        .limit(limit)
                        .totalItems(totalItems)
                        .totalPages(totalPages)
                        .DataList(movieList)
                        .build())
                .build());
    }
}
