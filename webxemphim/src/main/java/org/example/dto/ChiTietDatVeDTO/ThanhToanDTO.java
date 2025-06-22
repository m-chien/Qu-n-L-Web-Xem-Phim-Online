package org.example.dto.ChiTietDatVeDTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ThanhToanDTO {
    private String phuongThucThanhToan;
    private LocalDateTime ngayThanhToan;
}
