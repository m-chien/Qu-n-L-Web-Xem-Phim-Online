package org.example.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class KhachHangResponse {
    String idUser;
    String email;
    String matkhau;
    LocalDate ngaytao;
    String loaitaikhoan;
    String trangthai;
    String avatar_url;
    String idKhachhang;
    String hoten;
    String sdt;
    LocalDate ngaysinh;
    String gioitinh;

}
