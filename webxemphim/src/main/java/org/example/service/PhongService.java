package org.example.service;

import org.example.exception.AppException;
import org.example.exception.ErrorCode;
import org.example.model.phong;
import org.example.repository.PhongRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;

@Service
public class PhongService {
    private final PhongRepository phongRepository;

    public PhongService(PhongRepository phongRepository) {
        this.phongRepository = phongRepository;
    }
    public phong getPhongCoItNguoiDat(String tenphim, LocalTime suatChieu, LocalDate ngayChieu) {
        String idPhong = phongRepository.findIdPhongByTenphimAndSuatchieuAndNgaychieu(
                tenphim, suatChieu, ngayChieu
        );
        if (idPhong == null) {
            throw new AppException(ErrorCode.Not_Found);
        }
        return phongRepository.findById(idPhong)
                .orElseThrow(() -> new AppException(ErrorCode.Not_Found));
    }
}
