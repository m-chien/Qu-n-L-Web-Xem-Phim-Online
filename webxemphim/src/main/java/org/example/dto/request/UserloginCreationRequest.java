package org.example.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserloginCreationRequest {
    String email;
    String matkhau;
    String hoten;
    String sdt;
}
