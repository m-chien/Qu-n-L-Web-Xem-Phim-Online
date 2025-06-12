package org.example.repository;

import org.example.model.phong;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;

@Repository
public interface PhongRepository extends JpaRepository<phong, String> {
    @Query(value = "SELECT TOP 1 \n" +
            "    l.idPhong\n" +
            "FROM lichchieu l\n" +
            "JOIN phong p ON p.idPhong = l.idPhong\n" +
            "JOIN suatchieu s ON s.idSuatChieu = l.idSuatChieu\n" +
            "JOIN phim ph ON ph.idPhim = l.idPhim\n" +
            "LEFT JOIN chitietdatve ct \n" +
            "    ON ct.idLichChieu = l.idLichChieu \n" +
            "   AND ct.TrangThaiVe = N'Đã đặt'\n" +
            "WHERE \n" +
            "    ph.tenphim = :tenphim \n" +
            "    AND l.ngaychieu = :ngaychieu\n" +
            "    AND CONVERT(varchar, s.tgianchieu, 108) = CONVERT(varchar, :suatchieu, 108)\n" +
            "GROUP BY \n" +
            "    l.idLichChieu, l.idPhong\n" +
            "ORDER BY COUNT(ct.idChoNgoi) ASC",
            nativeQuery = true)
    String findIdPhongByTenphimAndSuatchieuAndNgaychieu(
            @Param("tenphim") String tenphim,
            @Param("suatchieu") LocalTime suatchieu,
            @Param("ngaychieu") LocalDate ngaychieu);


}
