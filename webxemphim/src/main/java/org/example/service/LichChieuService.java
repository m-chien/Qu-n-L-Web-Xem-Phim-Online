package org.example.service;

import org.example.repository.LichChieuRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class LichChieuService {
    private final LichChieuRepository lichChieuRepository;

    public LichChieuService(LichChieuRepository lichChieuRepository) {
        this.lichChieuRepository = lichChieuRepository;
    }
    public List<LocalDate> GetDateByIdphim(String idphim)
    {
        List<LocalDate> dates = lichChieuRepository.findNgaychieuByIdphim(idphim)
                .stream()
                .sorted()
                .collect(Collectors.toList());
        return dates;
    }
    public String getIdlichchieuByIdsuatchieuAndIdphong(String idsuatchieu,String idphong,LocalDate ngaychieu)
    {
        return lichChieuRepository.findIdByIdSuatChieuAndIdPhongAndNgaychieu(idsuatchieu,idphong,ngaychieu).orElseThrow(
                () -> new NoSuchElementException("không tìm thấy lịch chiếu!!"));
    }
}
