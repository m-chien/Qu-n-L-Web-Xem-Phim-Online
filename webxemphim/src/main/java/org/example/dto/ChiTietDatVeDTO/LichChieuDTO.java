package org.example.dto.ChiTietDatVeDTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LichChieuDTO {
    private LocalDate ngayChieu;
    private LocalTime tgianChieu;
}
