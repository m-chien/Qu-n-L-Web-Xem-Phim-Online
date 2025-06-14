package org.example.controller;

import lombok.RequiredArgsConstructor;
import org.example.dto.request.ApiResponse;
import org.example.dto.request.AuthenticationResponse;
import org.example.dto.request.UserLoginCreationRequest;
import org.example.dto.request.UserRegisterCreationRequest;
import org.example.exception.AppException;
import org.example.exception.ErrorCode;
import org.example.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

}
