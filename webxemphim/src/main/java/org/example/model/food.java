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
public class food {
    @Id
    String idFood;
    @Column(name = "TenDoAn")
    String tendoan;
    @Column(name = "MoTa")
    String mota;
    @Column(name = "GiaBan")
    BigDecimal giaban;
    @Column(name = "TrangThai")
    String trangthai;
    @Column(name = "soluongtonkho")
    int soluonngtonkho;
    String url_anh;
}
