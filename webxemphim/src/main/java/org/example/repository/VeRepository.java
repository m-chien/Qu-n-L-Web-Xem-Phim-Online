package org.example.repository;
import org.example.dto.request.LichSuVeResponse;
import org.example.model.ve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VeRepository extends JpaRepository< ve,String> {
    @Query(value = "SELECT v.idVe, p.url_poster, p.tenphim, v.NgayDat, " +
            "STRING_AGG(ch.hang + CAST(ch.cot AS VARCHAR(10)), ', ') AS DanhSachGhe, " +
            "v.TongGiaTriDonHang, v.trangthai " +
            "FROM chitietdatve c " +
            "JOIN ve v ON c.idVe = v.idVe " +
            "JOIN lichchieu l ON c.idLichChieu = l.idLichChieu " +
            "JOIN phim p ON l.idPhim = p.idPhim " +
            "JOIN chongoi ch ON ch.idChoNgoi = c.idChoNgoi " +
            "WHERE v.idUser = :Iduser " +
            "GROUP BY p.tenphim, v.NgayDat, v.TongGiaTriDonHang, v.idUser, v.trangthai, p.url_poster, v.idVe",
            nativeQuery = true)
    List<LichSuVeResponse> findVe(@Param("Iduser")String idUser);

    List<ve> findByTrangthaiAndNgayhethanBefore(String choThanhToan, LocalDateTime now);
}
