package org.example.repository;

import org.example.model.phimyeuthich;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface phimyeuthichrepository extends JpaRepository<phimyeuthich, String> {
    //boolean existsByIdUser(String idUser);
    //List<phimyeuthich> findByIdUser_IdUser(String iduser);
}
