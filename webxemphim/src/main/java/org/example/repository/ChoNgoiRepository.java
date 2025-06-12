package org.example.repository;

import org.example.model.chongoi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface ChoNgoiRepository extends JpaRepository<chongoi, String> {
    @Query(value = " SELECT ch.* \n" +
            "        FROM chitietdatve c\n" +
            "        JOIN chongoi ch ON c.idChoNgoi = ch.idChoNgoi\n" +
            "        WHERE c.idLichChieu = (\n" +
            "            SELECT TOP 1 l.idLichChieu\n" +
            "            FROM lichchieu l\n" +
            "            JOIN phim p ON l.idPhim = p.idPhim\n" +
            "            JOIN suatchieu s ON l.idSuatChieu = s.idSuatChieu\n" +
            "            LEFT JOIN chitietdatve ct \n" +
            "                ON ct.idLichChieu = l.idLichChieu AND ct.TrangThaiVe = N'Đã đặt'\n" +
            "            WHERE \n" +
            "                p.tenphim = :tenPhim\n" +
            "                AND l.ngaychieu = :ngayChieu\n" +
            "                AND CONVERT(varchar, s.tgianchieu, 108) = CONVERT(varchar, :gioChieu, 108)\n" +
            "            GROUP BY l.idLichChieu\n" +
            "            ORDER BY COUNT(ct.idChoNgoi) ASC\n" +
            "        )",nativeQuery = true)
    public List<chongoi> findChoNgoiDaDatTheoPhimSuatNgay(
            @Param("tenPhim") String tenPhim,
            @Param("ngayChieu") LocalDate ngayChieu,
            @Param("gioChieu") LocalTime gioChieu
    );
}
