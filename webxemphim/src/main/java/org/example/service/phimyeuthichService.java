package org.example.service;

import org.example.exception.NotFoundException;
import org.example.model.phimyeuthich;
import org.example.repository.phimrepository;
import org.example.repository.phimyeuthichrepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.crossstore.ChangeSetPersister;
import org.springframework.stereotype.Service;
import org.example.exception.AccessDeniedException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class phimyeuthichService {
    @Autowired
    private phimyeuthichrepository phimyeuthichrepository;

    public phimyeuthich addphim(phimyeuthich phimyeuthich)
    {
        return phimyeuthichrepository.save(phimyeuthich);
    }
//    public List<phimyeuthich> getallPhimyeuthichtheouser(String iduser)
//    {
//        return phimyeuthichrepository.findByIdUser_IdUser(iduser);
//    }


}
