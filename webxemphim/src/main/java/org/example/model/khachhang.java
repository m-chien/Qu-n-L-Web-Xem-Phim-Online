package org.example.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class khachhang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    String idUser;
    String tenUser;
    String diachiKh;
    @NotNull
    String sdt;
    String email;
    @NotNull
    String matkhau;

}
