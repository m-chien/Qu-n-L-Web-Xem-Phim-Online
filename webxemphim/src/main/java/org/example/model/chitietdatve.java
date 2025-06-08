package org.example.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class chitietdatve {
    @Id
    String idChiTietVe;
    String idVe;
    String idLichChieu;
    String idChoNgoi;
    @Column(name = "GiaVeDonLe")
    BigDecimal giaVeDonLe;
    @Column(name = "TrangThaiVe")
    String trangthaive;
}
