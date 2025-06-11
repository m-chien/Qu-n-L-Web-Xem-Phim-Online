package org.example.service;

import org.example.repository.DienVienRepository;
import org.example.repository.TheLoaiRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DienVienService {
    private final DienVienRepository dienVienRepository;

    public DienVienService(DienVienRepository dienVienRepository, TheLoaiRepository theLoaiRepository) {
        this.dienVienRepository = dienVienRepository;
    }

    public List<String> GetListActorByIdphim(String idphim)
    {
        return dienVienRepository.findTendienvienByPhimId(idphim);
    }
}
