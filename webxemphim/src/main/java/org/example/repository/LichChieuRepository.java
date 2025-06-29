package org.example.repository;

import org.example.model.lichchieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface LichChieuRepository extends JpaRepository<lichchieu, String> {
    @Query(value = "select distinct l.ngaychieu " +
            "from lichchieu l, phim p\n" +
            "where l.idPhim = p.idPhim  " +
                    "and p.idPhim = :phimId")
    List<LocalDate> findNgaychieuByIdphim(@Param("phimId") String idphim);
    @Query(value = "select idLichChieu from lichchieu where idPhong = :phong and idSuatChieu = :suatchieu and ngaychieu = :ngaychieu")
    Optional<String> findIdByIdSuatChieuAndIdPhongAndNgaychieu(
            @Param("suatchieu") String idsuatchieu,
            @Param("phong")  String idphong,
            @Param("ngaychieu")  LocalDate ngaychieu);
}
