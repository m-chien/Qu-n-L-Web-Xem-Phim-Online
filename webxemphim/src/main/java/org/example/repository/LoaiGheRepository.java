package org.example.repository;

import org.example.model.loaighe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoaiGheRepository extends JpaRepository<loaighe, String> {

}
