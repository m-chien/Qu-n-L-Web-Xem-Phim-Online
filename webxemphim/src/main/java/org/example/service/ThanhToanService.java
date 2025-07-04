package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.model.thanhtoan;
import org.example.repository.ThanhToanRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class ThanhToanService {
    private final ThanhToanRepository thanhToanRepository;
    private final JdbcTemplate jdbcTemplate;
    public synchronized String generateNextIdthanhtoan() {
        String prefix = "TT";
        String sql = "SELECT MAX(idThanhToan) FROM thanhtoan";
        String maxId = jdbcTemplate.queryForObject(sql, String.class);

        int nextNumber = 1;
        if (maxId != null) {
            String numberPart = maxId.replace(prefix, "");
            nextNumber = Integer.parseInt(numberPart) + 1;
        }

        return prefix + String.format("%03d", nextNumber);
    }

    public void addthanhtoan(String idve, BigDecimal totalPrice) {
        thanhtoan thanhtoan = new thanhtoan(generateNextIdthanhtoan(),idve,"online","Đang chờ",totalPrice, LocalDateTime.now());
        thanhToanRepository.saveAndFlush(thanhtoan);
    }

    public void updateThanhtoan(thanhtoan thanhtoan) {
        thanhtoan.setTrangthai("Thành công");
        thanhToanRepository.save(thanhtoan);
    }

    public thanhtoan getThanhtoanByidVe(String idve) {
        return thanhToanRepository.findByIdVe(idve);
    }

    public void updateThanhtoanFaile(thanhtoan thanhtoan) {
        thanhtoan.setTrangthai("Thất bại");
        thanhToanRepository.save(thanhtoan);
    }
}
