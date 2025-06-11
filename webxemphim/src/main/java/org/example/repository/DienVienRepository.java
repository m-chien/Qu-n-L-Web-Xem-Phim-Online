package org.example.repository;

import org.example.model.dienvien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DienVienRepository extends JpaRepository<dienvien,String> {
    @Query(value = "SELECT dv.tenDienVien FROM dienvien dv " +
            "JOIN dienvien_phim dvp ON dv.idDienVien = dvp.idDienVien " +
            "WHERE dvp.idPhim = :phimId",nativeQuery = true)
    List<String> findTendienvienByPhimId(@Param("phimId") String phimId);
}
