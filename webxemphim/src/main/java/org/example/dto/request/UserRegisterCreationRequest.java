package org.example.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserRegisterCreationRequest {
    String hoten;
    String email;
    String sdt;
    String matkhau;
}
