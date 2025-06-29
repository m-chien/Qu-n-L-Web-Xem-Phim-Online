package org.example.repository;

import org.example.model.suatchieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SuatChieuRepository extends JpaRepository<suatchieu, String> {
    @Query(value = "select distinct s.tgianchieu from lichchieu l, phim p, suatchieu s\n" +
            "where l.idPhim = p.idPhim  \n" +
            "\tand l.idSuatChieu = s.idSuatChieu\n" +
            "\tand p.idPhim = :idPhim \n" +
            "\tand l.ngaychieu = :Ngaychieu")
    List<LocalTime> findTgianchieuByIdphimAndNgaychieu(@Param("idPhim") String idphim, @Param("Ngaychieu")LocalDate ngaychieu);

    @Query(
            value = "SELECT idSuatChieu FROM suatchieu WHERE CONVERT(varchar, tgianchieu, 108) = CONVERT(varchar, :tgianchieu, 108)",
            nativeQuery = true
    )
    Optional<String> findIdByTgianchieu(@Param("tgianchieu") LocalTime tgianchieu);

}
