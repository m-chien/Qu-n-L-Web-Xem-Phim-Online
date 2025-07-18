package org.example.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "nguoidung")
public class nguoidung {
    @Id
    String idUser;
    String email;
    String matkhau;
    LocalDate ngaytao;
    String loaitaikhoan;
    String trangthai;
    @Column(name = "avatar_url")
    String avatar_url;
}
