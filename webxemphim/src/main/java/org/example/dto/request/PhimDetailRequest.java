package org.example.dto.request;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PhimDetailRequest {
    String idPhim;
    String tenphim;
    String daodien;
    int thoiLuong;
    LocalDate ngaySanXuat;
    Long luotXem;
    String quocgia;
    String gioihandotuoi;
    String trangthai;
    String moTaPhim;
    String url_anh;
    List<String> tendienvien;
    List<String> tentheloai;
}
