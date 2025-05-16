package org.example.repository;

import org.example.model.lichsuxemphim;


import org.example.model.lichsuxemphimId;
import org.example.model.phim;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


import java.util.List;
@Repository
public interface lichsuxemphimrepository extends JpaRepository<lichsuxemphim, lichsuxemphimId> {
    List<lichsuxemphim> findByIdUser(String idUser);
}
