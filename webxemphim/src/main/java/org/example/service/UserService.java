package org.example.service;

import jakarta.transaction.Transactional;
import org.example.dto.request.UserloginCreationRequest;
import org.example.model.khachhang;
import org.example.model.nguoidung;
import org.example.repository.KhachHangRepository;
import org.example.repository.nguoidungRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class UserService {
    public final nguoidungRepository nguoidungrepository;
    public final KhachHangRepository khachHangRepository;

    public UserService(nguoidungRepository nguoidungrepository, KhachHangRepository khachHangRepository) {
        this.nguoidungrepository = nguoidungrepository;
        this.khachHangRepository = khachHangRepository;
    }
    @Transactional
    public nguoidung adduser(UserloginCreationRequest userRequest)
    {
        String iduser = generateNewUserId();
        nguoidung nguoidung1 = nguoidung.builder()
                .idUser(iduser)
                .email(userRequest.getEmail())
                .matkhau(userRequest.getMatkhau())
                .ngaytao(LocalDate.now())
                .loaitaikhoan("Khách hàng")
                .trangthai("active")
                .build();
        String idkhachhang = generateNewCustomerId();
        khachhang khachhang1 = khachhang.builder()
                .idKhachhang(idkhachhang)
                .idUser(iduser)
                .sdt(userRequest.getSdt())
                .hoten(userRequest.getHoten())
                .build();
        nguoidung nguoidung2 = nguoidungrepository.save(nguoidung1);
        khachHangRepository.save(khachhang1);
        return nguoidung2;
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
