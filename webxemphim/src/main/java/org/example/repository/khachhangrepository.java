package org.example.repository;

import org.example.model.khachhang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface khachhangrepository extends JpaRepository<khachhang, String> {
    boolean existsByemail(String email);

    boolean existsBysdt(String sdt);

    boolean existsBymatkhau(String matkhau);
    @Query(value = "SELECT TOP 1 idUser FROM khachhang ORDER BY idUser DESC", nativeQuery = true)
    String findLastMaDatVe();
}
