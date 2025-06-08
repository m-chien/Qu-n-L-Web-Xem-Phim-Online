package org.example.repository;

import org.example.model.thanhtoan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ThanhToanRepository extends JpaRepository<thanhtoan, String> {
}
