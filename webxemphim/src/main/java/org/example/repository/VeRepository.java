package org.example.repository;
import org.example.model.ve;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VeRepository extends JpaRepository< ve,String> {
}
