package org.example.repository;

import org.example.model.nguoidung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface nguoidungRepository extends JpaRepository<nguoidung,String > {
    Optional<nguoidung> findTopByOrderByIdUserDesc();

    boolean existsByEmail(String email);

    nguoidung findByEmail(String email);
}
