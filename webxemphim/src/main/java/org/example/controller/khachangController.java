package org.example.controller;

import org.example.dto.request.ApiResponse;
import org.example.dto.request.khachhangCreationRequest;
import org.example.dto.request.khachhangUpdateRequest;
import org.example.model.khachhang;
import org.example.service.khachhangservice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
public class khachangController {
    @Autowired
    private khachhangservice  khachhangservice;

    @GetMapping("/getall")
    public List<khachhang> getall()
    {
        return khachhangservice.getallkhachang();
    }
    @GetMapping("/{userId}")
    public ApiResponse<khachhang> getkhachhang(@PathVariable String userId)
    {
        ApiResponse<khachhang> api = new ApiResponse<>();
        api.setMessage("lấy thành công rồi nha!!");
        api.setResult(khachhangservice.getonekhachhang(userId));
        return api;
    }
    @PostMapping("/add")
    public ApiResponse<khachhang> createKhachhang(@RequestBody khachhangCreationRequest khachhangCreationRequest) {
        ApiResponse<khachhang> apiResponse = new ApiResponse<>();
        apiResponse.setResult(khachhangservice.adduser(khachhangCreationRequest));
        return apiResponse;
    }
    @PutMapping("/{userId}")
    public ApiResponse<khachhang>  updatekhachhang(@PathVariable String userId, @RequestBody khachhangUpdateRequest khachhangUpdateRequest)
    {
        ApiResponse<khachhang> update = new ApiResponse<>();
        update.setMessage("cập nhật thành công rồi nha bạn");
        update.setResult(khachhangservice.update(userId,khachhangUpdateRequest));
        return update;
    }
    @DeleteMapping("/{userid}")
    public ApiResponse<String> xoakhachhang(@PathVariable String userid)
    {
        khachhangservice.delete(userid);
        return new ApiResponse<>(1000,"thành công!!!!","xóa thành công id "+ userid);
    }
}
