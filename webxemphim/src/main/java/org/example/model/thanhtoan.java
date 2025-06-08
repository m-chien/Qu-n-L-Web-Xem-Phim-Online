package org.example.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class thanhtoan {
    @Id
    String idThanhToan;
    String idVe;
    String phuongthucthanhtoan;
    String trangthai;
    BigDecimal soTienThanhToan;
    LocalDateTime ngayThanhToan;
}
