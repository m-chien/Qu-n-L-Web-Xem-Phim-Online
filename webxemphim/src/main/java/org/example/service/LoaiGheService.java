package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.model.loaighe;
import org.example.repository.LoaiGheRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class LoaiGheService {
    private final LoaiGheRepository loaiGheRepository;

    public BigDecimal findGiaById(String idloaighe) {
        loaighe lg = loaiGheRepository.findById(idloaighe).orElseThrow(() -> new RuntimeException("không có idloiaghe"));
        return lg.getGia();
    }
}
