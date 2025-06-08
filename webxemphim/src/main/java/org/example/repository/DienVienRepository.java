package org.example.repository;

import org.example.model.dienvien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DienVienRepository extends JpaRepository<dienvien,String> {
}
