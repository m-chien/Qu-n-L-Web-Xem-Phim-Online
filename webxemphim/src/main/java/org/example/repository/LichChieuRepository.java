package org.example.repository;

import org.example.model.lichchieu;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LichChieuRepository extends JpaRepository<lichchieu, String> {
}
