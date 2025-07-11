package org.example.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@FieldDefaults(level = AccessLevel.PRIVATE)
public class nhanvien {
    @Id
    String idNhanvien;
    String idUser;
    String hoten;
    String sdt;
    String emaillienhe;
    String gioitinh;
    String chucvu;
    @Column(name = "Luong")
    BigDecimal luong;
    String trangthai;
}
