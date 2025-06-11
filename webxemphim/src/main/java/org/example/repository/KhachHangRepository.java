package org.example.repository;

import org.example.model.khachhang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KhachHangRepository extends JpaRepository<khachhang,String > {
    Optional<khachhang> findTopByOrderByIdKhachhangDesc();

    boolean existsBySdt(String sdt);
}
