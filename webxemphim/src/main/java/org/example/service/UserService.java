package org.example.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.dto.request.AuthenticationResponse;
import org.example.dto.request.UserLoginCreationRequest;
import org.example.dto.request.UserRegisterCreationRequest;
import org.example.exception.AppException;
import org.example.exception.ErrorCode;
import org.example.model.khachhang;
import org.example.model.nguoidung;
import org.example.repository.KhachHangRepository;
import org.example.repository.nguoidungRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {
    public final nguoidungRepository nguoidungrepository;
    public final KhachHangRepository khachHangRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public void adduser(UserRegisterCreationRequest userRequest)
    {
        if(nguoidungrepository.existsByEmail(userRequest.getEmail()))
        {
            throw new AppException(ErrorCode.Email_Duplicate);
        }
        if (khachHangRepository.existsBySdt(userRequest.getSdt()))
        {
            throw new AppException(ErrorCode.Sdt_Duplicate);
        }
        String iduser = generateNewUserId();
        nguoidung nguoidung1 = nguoidung.builder()
                .idUser(iduser)
                .email(userRequest.getEmail())
                .matkhau(userRequest.getMatkhau())
                .ngaytao(LocalDate.now())
                .loaitaikhoan("Khách hàng")
                .trangthai("active")
                .avatar_url("/images/user-circle (1).png")
                .build();
        nguoidung1.setMatkhau(passwordEncoder.encode(userRequest.getMatkhau()));
        String idkhachhang = generateNewCustomerId();
        khachhang khachhang1 = khachhang.builder()
                .idKhachhang(idkhachhang)
                .idUser(iduser)
                .sdt(userRequest.getSdt())
                .hoten(userRequest.getHoten())
                .build();
        nguoidungrepository.save(nguoidung1);
        khachHangRepository.save(khachhang1);
    }
    public AuthenticationResponse CheckUserAccount(UserLoginCreationRequest user)
    {
        nguoidung nguoidung1 = nguoidungrepository.findByEmail(user.getEmail());
        if (nguoidung1 == null)
        {
            throw new AppException(ErrorCode.Not_Found);
        }
        if (!passwordEncoder.matches(user.getMatkhau(),nguoidung1.getMatkhau()))
        {
            throw new AppException(ErrorCode.Wrong_Password);
        }
        var token = jwtService.generateToken(nguoidung1.getEmail());
        return AuthenticationResponse.builder()
                .token(token)
                .user(nguoidungrepository.findCustom(nguoidung1.getEmail()))
                .build();
    }
    private String generateNewUserId() {
        Optional<nguoidung> lastKhachHang = nguoidungrepository
                .findTopByOrderByIdUserDesc();
        String lastId = lastKhachHang.map(nguoidung::getIdUser).orElse("U0000");
        int number = Integer.parseInt(lastId.substring(1)) + 1;
        return String.format("U%04d", number);
    }
    private String generateNewCustomerId() {
        Optional<khachhang> lastKhachHang = khachHangRepository
                .findTopByOrderByIdKhachhangDesc();
        String lastId = lastKhachHang.map(khachhang::getIdKhachhang).orElse("KH000");
        int number = Integer.parseInt(lastId.substring(2)) + 1;
        return String.format("KH%03d", number);
    }
}
