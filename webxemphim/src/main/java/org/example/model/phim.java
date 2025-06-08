package org.example.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class phim {
    @Id
    String idPhim;
    String tenphim;
    @Column(name = "DaoDien")
    String daodien;
    @Column(name = "thoiluong")
    int thoiLuong;
    @Column(name = "ngayphathanh")
    LocalDate ngaySanXuat;
    @Column(name = "luotxem")
    Long luotXem;
    @Column(name = "quocgia")
    String quocgia;
    @Column(name = "gioihandotuoi")
    String gioihandotuoi;
    @Column(name = "trangthai")
    String trangthai;
    @Column(name = "mo_ta")
    String moTaPhim;
    @Column(name = "url_poster")
    String url_anh;
}
