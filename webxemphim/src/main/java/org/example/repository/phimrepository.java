package org.example.repository;

import org.example.model.phim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface phimrepository extends JpaRepository<phim,String> {
    Optional<phim> findByTenphim(String tenphim);
}
