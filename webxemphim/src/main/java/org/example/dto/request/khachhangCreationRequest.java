package org.example.dto.request;

import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class khachhangCreationRequest {
    String tenUser;
    String diachiKh;
    String sdt;
    String email;
    String matkhau;
}
