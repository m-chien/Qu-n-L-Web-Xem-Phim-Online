package org.example.service;

import org.example.model.chongoi;
import org.example.repository.ChoNgoiRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class ChoNgoiService {
    private final ChoNgoiRepository choNgoiRepository;

    public ChoNgoiService(ChoNgoiRepository choNgoiRepository) {
        this.choNgoiRepository = choNgoiRepository;
    }
    public List<chongoi> GetChoNgoiByPhong(String tenphim, LocalTime suatchieu, LocalDate ngaychieu)
    {
        return choNgoiRepository.findChoNgoiDaDatTheoPhimSuatNgay(tenphim,ngaychieu,suatchieu);
    }
}
