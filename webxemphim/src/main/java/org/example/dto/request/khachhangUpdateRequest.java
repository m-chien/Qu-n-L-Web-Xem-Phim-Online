package org.example.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class khachhangUpdateRequest {
    String idUser;
    String hoten;
    String sdt;
    String ngaysinh;
    String gioitinh;
}
