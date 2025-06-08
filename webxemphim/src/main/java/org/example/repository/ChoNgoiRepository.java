package org.example.repository;

import org.example.model.chongoi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ChoNgoiRepository extends JpaRepository<chongoi, String> {
}
