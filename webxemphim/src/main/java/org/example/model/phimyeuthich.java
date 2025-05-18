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
public class phimyeuthich {
    @Id
    String idphimyeuthich;

    @ManyToOne
    @JoinColumn(name = "idUser", referencedColumnName = "idUser")
    khachhang idUser; // ID của khách hàng
    @ManyToOne
    @JoinColumn(name = "idPhim", referencedColumnName = "idPhim")
    phim idPhim; // ID của phim

    LocalDate ngayluu;
}
