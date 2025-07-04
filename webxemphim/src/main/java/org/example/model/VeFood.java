package org.example.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data; // Sử dụng Lombok để tự động tạo getters/setters, toString, equals, hashCode
import lombok.NoArgsConstructor;

/**
 * Lớp Entity đại diện cho bảng Ve_Food.
 * Chứa khóa chính kép và thuộc tính SoLuong.
 * Đây là bảng trung gian cho mối quan hệ nhiều-nhiều giữa Ve và Food.
 */
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "ve_food")
@Data
public class VeFood {
    @Id
    @Column(name = "idvefood")
    private String vefoodId;
    @Column(name = "idVe")
    private String idve;
    @Column(name = "idFood")
    private String idfood;
    @Column(name = "soluong")
    private Integer soLuong;
}