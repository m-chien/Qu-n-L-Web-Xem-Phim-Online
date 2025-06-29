package org.example.service;

import org.example.exception.AppException;
import org.example.exception.ErrorCode;
import org.example.repository.SuatChieuRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class SuatChieuService {
    private final SuatChieuRepository suatChieuRepository;

    public SuatChieuService(SuatChieuRepository suatChieuRepository) {
        this.suatChieuRepository = suatChieuRepository;
    }
    public List<LocalTime> getSuatchieuByPhim(String idphim, LocalDate ngaychieu)
    {
        List<LocalTime> suatchieu = suatChieuRepository.findTgianchieuByIdphimAndNgaychieu(idphim, ngaychieu)
                .stream()
                .sorted()
                .collect(Collectors.toList());
        if (suatchieu.isEmpty()) throw new AppException(ErrorCode.Not_Found);
        return suatchieu;
    }
    public String getIdsuatchieubyTgianchieu(LocalTime tgianchieu)
    {
        return suatChieuRepository.findIdByTgianchieu(tgianchieu)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy suất chiếu với thời gian: " + tgianchieu));
    }
}
