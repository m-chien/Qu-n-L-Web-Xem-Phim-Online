package org.example.dto.ChiTietDatVeDTO;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class PhimInfoDTO {
    private String urlPoster;
    private String tenPhim;
    private String moTa;
    private int thoiLuong;
}
