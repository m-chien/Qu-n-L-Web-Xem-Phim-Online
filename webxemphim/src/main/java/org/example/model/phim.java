package org.example.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String idPhim;
    private String tenphim;
    private String daodien;
    private String MoTaPhim;
    private int ThoiLuong;
    private LocalDate NgaySanXuat;
    private int LuotXem;
    private String quocgia;
    private int gioihandotuoi;
}
