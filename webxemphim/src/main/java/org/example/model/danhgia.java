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
    String idUser;
    String idPhim;
    @Column(name = "diemdanhgia")
    int diemDanhGia;
    @Column(name = "ngaydanhgia")
    LocalDate ngayDanhGia;
    String binhluan;
}
