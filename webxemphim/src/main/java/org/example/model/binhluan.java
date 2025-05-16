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
public class binhluan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    String idBinhLuan;

    @ManyToOne
    @JoinColumn(name = "idUser", referencedColumnName = "idUser")
    khachhang idUser; // ID của khách hàng
    @ManyToOne
    @JoinColumn(name = "idPhim", referencedColumnName = "idPhim")
    phim idPhim; // ID của phim

    String noiDung; // Nội dung bình luận

    LocalDate ngayDang; // Ngày đăng bình luận
}
