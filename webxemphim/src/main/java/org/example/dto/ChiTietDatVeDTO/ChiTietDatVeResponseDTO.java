package org.example.dto.ChiTietDatVeDTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ChiTietDatVeResponseDTO {
    private PhimInfoDTO phimInfo;
    private List<String> theloai;
    private DanhGiaDTO danhGia;
    private LichChieuDTO lichChieu;
    private List<String> danhSachGhe;
    private VeInfoDTO veInfo;
    private ThanhToanDTO thanhToan;
    private String phong;
}
