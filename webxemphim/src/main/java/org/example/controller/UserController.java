package org.example.controller;

import com.nimbusds.jose.JOSEException;
import lombok.RequiredArgsConstructor;
import org.example.dto.request.ApiResponse;
import org.example.dto.request.AuthenticationResponse;
import org.example.dto.request.UserLoginCreationRequest;
import org.example.dto.request.UserRegisterCreationRequest;
import org.example.exception.AppException;
import org.example.exception.ErrorCode;
import org.example.model.khachhang;
import org.example.model.nguoidung;
import org.example.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody UserRegisterCreationRequest user)
    {
        ApiResponse ans = new ApiResponse<>();
        userService.adduser(user);
        ans.setMessage("Đăng Ký Thành Công!");
        return ResponseEntity.status(HttpStatus.CREATED).body(ans);
    }
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthenticationResponse>> checkLogin(@RequestBody UserLoginCreationRequest userRequest) {
        ApiResponse<AuthenticationResponse> apiResponse = new ApiResponse<>();
        AuthenticationResponse authResponse = userService.CheckUserAccount(userRequest);
        apiResponse.setResult(authResponse);
        apiResponse.setMessage("Đăng nhập thành công");
        return ResponseEntity.ok(apiResponse); // 200 OK
    }
    @GetMapping("/user")
    public ResponseEntity<ApiResponse<List<nguoidung>>>  GetAllUser()
    {
        ApiResponse<List<nguoidung>> apiResponse = ApiResponse.<List<nguoidung>>builder()
                .code(1000)
                .message("Lấy thành công!!")
                .result(userService.GetAllNguoidung())
                .build();
        return ResponseEntity.ok(apiResponse);
    }
    //sau khi update xong sẽ lấy link ảnh đó trả ngược về lại cho frontend
    @PostMapping("/upAva")
    public ResponseEntity<ApiResponse<String>> updateAvatar(
            @RequestParam("avatar") MultipartFile file,
            @RequestHeader("Authorization") String authorizationHeader) {

        String token = null;
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        }
        if (file.isEmpty()) return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                        .code(1001)
                        .message("ảnh không hợp lệ")
                        .build());
        if (token == null || token.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.<String>builder()
                        .code(1001)
                        .message("Token không hợp lệ")
                        .build());
        }
        try {
            String link_ava = userService.updateAvatar(token, file);
            return ResponseEntity.ok(ApiResponse.<String>builder()
                    .message("Cập nhật thành công avatar")
                    .result(link_ava)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.<String>builder()
                            .code(500)
                            .message("Lỗi khi cập nhật avatar: " + e.getMessage())
                            .build());
        }

    }

}
