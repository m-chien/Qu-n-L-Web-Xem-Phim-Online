package org.example.dto.ChiTietDatVeDTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class VeInfoDTO {
    private String idVe;
    private String trangThai;
    private BigDecimal tongTien;
    private BigDecimal tienVe;
    private BigDecimal tienDoAn;
}
