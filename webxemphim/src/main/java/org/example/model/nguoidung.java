package org.example.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class nguoidung {
    @Id
    String idUser;
    String email;
    String matkhau;
    String ngaytao;
    String loaitaikhoan;
    String trangthai;
}
