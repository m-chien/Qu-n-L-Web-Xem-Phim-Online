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
    private String idPhim;
    private String tenphim;
    @Column(name = "DaoDien")
    private String daodien;
    @Column(name = "thoiluong")
    private int thoiLuong;
    @Column(name = "ngayphathanh")
    private LocalDate ngaySanXuat;
    @Column(name = "luotxem")
    private int luotXem;
    private String quocgia;
    private int gioihandotuoi;
    private String trangthai;
    @Column(name = "mo_ta")
    private String moTaPhim;
    @Column(name = "url_poster")
    private String url_anh;
}
