package org.example.service;

import org.example.repository.TheLoaiRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TheLoaiService {
    private final TheLoaiRepository theLoaiRepository;

    public TheLoaiService(TheLoaiRepository theLoaiRepository) {
        this.theLoaiRepository = theLoaiRepository;
    }
    public List<String> GetAllTheloaiByIdphim(String idphim)
    {
        return theLoaiRepository.findTentheloaiByPhimId(idphim);
    }

}
