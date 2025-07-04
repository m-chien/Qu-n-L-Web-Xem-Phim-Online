package org.example.repository;

import org.example.model.VeFood;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VeFoodRepository extends JpaRepository<VeFood,String> {

}
