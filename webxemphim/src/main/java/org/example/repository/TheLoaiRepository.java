package org.example.repository;

import org.example.model.theloai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TheLoaiRepository extends JpaRepository<theloai, String> {
    @Query(value = "SELECT tl.tentheloai FROM theloai tl " +
            "JOIN theloai_phim tlp ON tl.idTheLoai = tlp.idTheLoai " +
            "WHERE tlp.idPhim = :phimId",nativeQuery = true)
    List<String> findTentheloaiByPhimId(@Param("phimId") String phimId);
}
