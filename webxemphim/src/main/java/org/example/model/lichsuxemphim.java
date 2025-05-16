package org.example.model;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
@IdClass(lichsuxemphimId.class)
public class lichsuxemphim {
    @Id
    String idUser;
    @Id
    String idPhim;
    LocalDate ngayxem;
}
