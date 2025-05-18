package org.example.model;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class danhgia {
    @Id
    String idDanhGia;
    @ManyToOne
    @JoinColumn(name = "idUser", referencedColumnName = "idUser")
    khachhang idUser; // ID của khách hàng
    @ManyToOne
    @JoinColumn(name = "idPhim", referencedColumnName = "idPhim")
    phim idPhim; // ID của phim
    int diemDanhGia; // Điểm đánh giá
    LocalDate ngayDanhGia; // Ngày đánh giá
}
