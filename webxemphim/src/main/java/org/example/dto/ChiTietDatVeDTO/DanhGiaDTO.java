package org.example.dto.ChiTietDatVeDTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DanhGiaDTO {
    private int soLuotDanhGia;
    private double diemDanhGiaTrungBinh;
}
