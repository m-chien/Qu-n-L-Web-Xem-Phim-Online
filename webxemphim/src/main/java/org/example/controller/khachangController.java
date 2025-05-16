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
    public khachhang getkhachhang(@PathVariable String userId)
    {
        return khachhangservice.getonekhachhang(userId);
    }
    @PostMapping("/add")
    public ApiResponse<khachhang> createKhachhang(@RequestBody khachhangCreationRequest khachhangCreationRequest) {
        ApiResponse<khachhang> apiResponse = new ApiResponse<>();
        khachhang newKhachhang = khachhangservice.adduser(khachhangCreationRequest);
        apiResponse.setResult(newKhachhang);
        return apiResponse;
    }
    @PutMapping("/{userId}")
    public khachhang updatekhachhang(@PathVariable String userId, @RequestBody khachhangUpdateRequest khachhangUpdateRequest)
    {
        return khachhangservice.update(userId,khachhangUpdateRequest);
    }
    @DeleteMapping("/{userid}")
    public void xoakhachhang(@PathVariable String userid)
    {
        khachhangservice.delete(userid);
        System.out.println("xóa thành công rồi nha!!!");
    }
}
