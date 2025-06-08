package org.example.repository;

import org.example.model.chitietdatve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChiTietDatVeRepository extends JpaRepository<chitietdatve, String> {
}
