package org.example.repository;

import org.example.model.nguoidung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface nguoidungRepostory extends JpaRepository<nguoidung,String > {

}
