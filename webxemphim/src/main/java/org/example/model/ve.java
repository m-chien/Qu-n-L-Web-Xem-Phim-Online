package org.example.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ve {
    @Id
    String idVe;
    String idUser;
    @Column(name = "NgayDat")
    LocalDateTime ngaydat;
    @Column(name = "TongGiaTriDonHang")
    BigDecimal tongGiaTriDonHang;
    String trangthai;
    LocalDateTime ngayhethan;
}
