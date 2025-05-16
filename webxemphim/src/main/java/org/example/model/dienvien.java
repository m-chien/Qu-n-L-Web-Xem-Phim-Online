package org.example.model;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class dienvien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private String idDienVien;
    private String tenDienVien;
    private LocalDate ngaysinh;
    private String quoctich;
    private String mota;
}
