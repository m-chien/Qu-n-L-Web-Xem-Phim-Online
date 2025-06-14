package org.example.repository;

import org.example.dto.request.KhachHangResponse;
import org.example.model.nguoidung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface nguoidungRepository extends JpaRepository<nguoidung,String > {
    Optional<nguoidung> findTopByOrderByIdUserDesc();

    boolean existsByEmail(String email);

    nguoidung findByEmail(String email);

    @Query("SELECT new org.example.dto.request.KhachHangResponse(" +
            "n.idUser, n.email, n.matkhau, n.ngaytao, n.loaitaikhoan," +
            "n.trangthai, n.avatar_url," +
            "k.idKhachhang, k.hoten, k.sdt, k.ngaysinh, k.gioitinh) " +
            "FROM nguoidung n, khachhang k " + // <-- Liệt kê cả hai Entity ở đây
            "WHERE n.idUser = k.idUser AND n.email = :email") // <-- Điều kiện JOIN và điều kiện lọc
    KhachHangResponse findCustom(@Param("email") String email);


}
