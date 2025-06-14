package org.example.model;

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
@Table(name = "khachhang")
public class khachhang {
    @Id
    String idKhachhang;
    String idUser;
    String hoten;
    String sdt;
    LocalDate ngaysinh;
    String gioitinh;
}
